import { gmail, oauth2Client } from './AuthClient';
import { supabase } from '../../utils/supabase';

const getMostRecentMessageWithTag = async (email, accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });
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

export default async function handler(req, res) {
  const data = Buffer.from(req.body.message.data, 'base64').toString();
  const newMessageNotification = JSON.parse(data);
  const email = newMessageNotification.emailAddress;
  let { data: tokens, error } = await supabase
    .from('tokens')
    .select('access_token,refresh_token')
    .eq('email', email)
    .single();

  console.log(tokens, email);

  // const message = await getMostRecentMessageWithTag(email, tokens.access_token);

  // if (message) {
  //   const messageInfo = extractInfoFromMessage(message);
  //   console.log({ message, ...messageInfo });
  // }

  // console.log(newMessageNotification);

  res.status(200).json({ something: 'something' });
}
