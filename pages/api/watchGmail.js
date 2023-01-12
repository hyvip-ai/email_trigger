import { gmail, oauth2Client } from './AuthClient';
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
    console.log(JSON.stringify(message.data.payload.headers));
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
  toEmail,
  fromEmail,
}) => {
  oauth2Client.setCredentials({ access_token, refresh_token });
  const text = `To: ${fromEmail
    ?.split(' <')[1]
    .slice(0, fromEmail.split(' <')[1].length - 1)}\r\n\r\n Hello ${
    fromEmail.split(' <')[0].split(' ')[0]
  },\nThe message text goes here\nRegards,\nRajat Mondal`;

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

  // needed.Subject

  if (needed['Subject']?.toLowerCase() === 'match with this') {
    try {
      await createDraft({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        threadId,
        toEmail: needed['To'],
        fromEmail: needed['From'],
      });
    } catch (err) {
      console.log(err);
    }
  }
  res.status(200).json({ message: 'successful' });
}
