import { google } from 'googleapis';
import { gmail, oauth2Client } from './AuthClient';

export default async function handler(req, response) {
  const code = req.body.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const res = await gmail.users.getProfile({
    auth: oauth2Client,
    userId: 'me',
  });

  return response
    .status(200)
    .json({ tokens: { ...tokens }, email: res.data.emailAddress });
}
