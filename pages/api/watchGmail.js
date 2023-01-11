// watchGmailMessages = async (event) => {
//   try {
//     await auth.auth.requireAuth(null, null, email);
//   } catch (err) {
//     console.log('An error has occurred in the auth process.');
//     throw err;
//   }
//   const authClient = await auth.auth.authedUser.getClient();
//   google.options({ auth: authClient });

//   // Process the incoming message.
//   const message = await getMostRecentMessageWithTag(email, historyId);
//   if (message) {
//     const messageInfo = extractInfoFromMessage(message);
//     if (messageInfo.attachmentId && messageInfo.attachmentFilename) {
//       const attachment = await extractAttachmentFromMessage(
//         email,
//         messageInfo.messageId,
//         messageInfo.attachmentId
//       );
//       const topLabels = await analyzeAttachment(
//         attachment.data.data,
//         messageInfo.attachmentFilename
//       );
//       await updateReferenceSheet(
//         messageInfo.from,
//         messageInfo.attachmentFilename,
//         topLabels
//       );
//     }
//   }
// };

export default async function handler(req, res) {
  const data = Buffer.from(req.body.message.data, 'base64').toString();
  const newMessageNotification = JSON.parse(data);
  const email = newMessageNotification.emailAddress;
  const historyId = newMessageNotification.historyId;
  console.log(email);
  console.log(historyId);
  res.status(200).json({ something: 'something' });
}
