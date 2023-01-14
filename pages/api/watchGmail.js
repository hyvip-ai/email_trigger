import { gmail, oauth2Client, openai } from './AuthClient';
import { supabase } from '../../utils/supabase';

const encodeMessage = (message) => {
  return btoa(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const neededNames = ['From', 'Subject', 'To'];

const getMostRecentMessageWithTag = async (
  email,
  access_token,
  refresh_token
) => {
  oauth2Client.setCredentials({ access_token, refresh_token });
  const listMessagesRes = await gmail.users.messages.list({
    userId: email,
    maxResults: 1,
  });
  const messageId = listMessagesRes.data.messages[0].id;

  // Get the message using the message ID.
  if (messageId) {
    const message = await gmail.users.messages.get({
      userId: email,
      id: messageId,
    });
    const needed = message.data.payload.headers
      .filter((item) => neededNames.includes(item.name))
      .reduce((acc, item) => {
        return (acc = { ...acc, [item.name]: item.value });
      }, {});
    return { needed, threadId: message.data.threadId };
  }
};

const createDraft = async ({
  access_token,
  refresh_token,
  threadId,
  reply,
  fromEmail,
  subject,
  regardName,
}) => {
  oauth2Client.setCredentials({ access_token, refresh_token });
  const text = `Subject: Re: ${subject}\nTo: ${fromEmail
    ?.split(' <')[1]
    .slice(0, fromEmail.split(' <')[1].length - 1)}\r\n\r\nHello ${
    fromEmail.split(' <')[0].split(' ')[0]
  },\n\n${reply}\n\nRegards,\n${regardName}`;

  await gmail.users.drafts.create({
    userId: 'me',
    access_token,
    requestBody: {
      message: {
        threadId,
        raw: encodeMessage(text),
      },
    },
  });
};

const checkIfSame = async (predefinedLine, subjectLine, replyType) => {
  const body = JSON.stringify({
    inputs: {
      source_sentence: predefinedLine,
      sentences: [subjectLine],
    },
  });

  const res = await fetch(process.env.SENTENCE_MATCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUGGING_AUTH_TOKEN}`,
    },
    body,
  }).then((res) => res.json());
  return { matches: res[0] > 0.7, subjectLine, replyType };
};

const generateReply = async (subject, replyManner) => {
  const replyRes = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `write a reply for "${subject}", ${replyManner}`,
    temperature: 0.9,
    max_tokens: 2048,
    user: '1',
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['#', ';'],
  });

  return replyRes.data.choices[0].text;
};

export default async function handler(req, res) {
  const data = Buffer.from(req.body.message.data, 'base64').toString();
  const newMessageNotification = JSON.parse(data);
  const email = newMessageNotification.emailAddress;
  let { data: tokens } = await supabase
    .from('tokens')
    .select('access_token,refresh_token,replyTypes,nickName')
    .eq('email', email)
    .single();

  const { needed, threadId } = await getMostRecentMessageWithTag(
    email,
    tokens.access_token,
    tokens.refresh_token
  );

  if (!needed['Subject']?.includes('Re:')) {
    const predefinedLines = Object.keys(tokens.replyTypes).map((item) => ({
      subjectLine: tokens.replyTypes[item].emailSubject,
      replyType: tokens.replyTypes[item].reply,
    }));
    let promises = [];
    for (let i = 0; i < predefinedLines.length; i++) {
      promises.push(
        checkIfSame(
          predefinedLines[i].subjectLine,
          needed['Subject'],
          predefinedLines[i].replyType
        )
      );
    }
    const matchesArray = await Promise.all(promises);
    console.log(matchesArray);

    const matchedData = matchesArray.find((item) => item.matches);

    if (matchedData?.matches) {
      let reply = await generateReply(
        needed['Subject'],
        matchedData?.replyType
      );
      reply = reply.replace(/^\s+|\s+$/g, '').trim();
      try {
        await createDraft({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          threadId,
          toEmail: needed['To'],
          fromEmail: needed['From'],
          reply,
          subject: needed['Subject'],
          regardName: tokens.nickName,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
  res.status(200).json({ message: 'successful' });
}
