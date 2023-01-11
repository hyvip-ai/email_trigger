import { oauth2Client } from './AuthClient';

export default async function handler(req, res) {
  const code = req.body.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return res.status(200).json({ tokens });
}
