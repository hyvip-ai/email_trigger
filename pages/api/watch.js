import { gmail, oauth2Client } from './AuthClient';
import cookie from 'cookie';

export default async function handler(req, response) {
  const access_token = cookie.parse(req.headers.cookie).access_token;
  oauth2Client.setCredentials({ access_token });
  const { data } = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['INBOX'],
      topicName: `projects/${process.env.PROJECT_ID}/topics/watch_inbox_topic`,
    },
  });
  response.status(200).json({ ...data });
}
