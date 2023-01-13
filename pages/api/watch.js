import { supabase } from '../../utils/supabase';
import { gmail, oauth2Client } from './AuthClient';

export default async function handler(req, response) {
  let { data: tokens } = await supabase
    .from('tokens')
    .select('access_token,refresh_token')
    .eq('email', 'rm2932002@gmail.com')
    .single();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
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
