import { gmail, oauth2Client } from './AuthClient';

export default async function handler(req, response) {
  oauth2Client.setCredentials({
    access_token: req.body.accessToken,
  });
  const { data } = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['INBOX'],
      topicName: `projects/${process.env.PROJECT_ID}/topics/watch_inbox_topic`,
    },
  });
  response.status(200).json({ ...data });
}
