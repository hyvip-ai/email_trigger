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
}) => {
  oauth2Client.setCredentials({ access_token, refresh_token });
  const text = `Subject: Re: ${subject}\nTo: ${fromEmail
    ?.split(' <')[1]
    .slice(0, fromEmail.split(' <')[1].length - 1)}\r\n\r\nHello ${
    fromEmail.split(' <')[0].split(' ')[0]
  },\n\n${reply}\n\nRegards,\nRajat Mondal`;

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

const checkIfSame = async (predefinedLine, subjectLine) => {
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
  console.log(res[0]);
  return res[0] > 0.75;
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
    .select('access_token,refresh_token')
    .eq('email', email)
    .single();

  const { needed, threadId } = await getMostRecentMessageWithTag(
    email,
    tokens.access_token,
    tokens.refresh_token
  );

  if (!needed['Subject']?.includes('Re:')) {
    const condition = await checkIfSame(
      'asking to grab coffee',
      needed['Subject']
    );

    if (condition) {
      let reply = await generateReply(
        needed['Subject'],
        'politely appreciate them and reject the offer and tell them I am free after 26th jan'
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
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
  res.status(200).json({ message: 'successful' });
}

// reply manner

// `${subjectOfEmail} reply this in ${replyManner} in ${wordCount} words`;
