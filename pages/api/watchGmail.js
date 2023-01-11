import { gmail } from './AuthClient';

const getMostRecentMessageWithTag = async (email, historyId) => {
  // Look up the most recent message.
  const listMessagesRes = await gmail.users.messages.list({
    userId: email,
    maxResults: 1,
  });
  const messageId = await checkForDuplicateNotifications(
    listMessagesRes.data.messages[0].id
  );

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
  const historyId = newMessageNotification.historyId;
  const message = await getMostRecentMessageWithTag(email, historyId);

  if (message) {
    const messageInfo = extractInfoFromMessage(message);
    console.log({ message, ...messageInfo });
  }

  res.status(200).json({ something: 'something' });
}
