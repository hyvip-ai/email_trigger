import { gmail, oauth2Client } from './AuthClient';
import { supabase } from '../../utils/supabase';

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

    return message;
  }
};

const extractInfoFromMessage = (message) => {
  const messageId = message.data.id;
  let from;

  const headers = message.data.payload.headers;
  for (var i in headers) {
    if (headers[i].name === 'From') {
      from = headers[i].value;
    }
  }

  return {
    messageId: messageId,
    from: from,
  };
};

const createDraft = (access_token, refresh_token, threadId) => {
  oauth2Client.setCredentials({ access_token, refresh_token });
  gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: {
        threadId,
        payload: {
          body: {
            data: 'This is a draft message, Just replying It buddy, dont worry',
          },
        },
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

  const message = await getMostRecentMessageWithTag(
    email,
    tokens.access_token,
    tokens.refresh_token
  );

  if (message) {
    const messageInfo = extractInfoFromMessage(message);
    console.log({ ...message, ...messageInfo });
  }

  // createDraft(tokens.access_token, tokens.refresh_token, message.data.threadId);

  res.status(200).json({ something: 'something' });
}
