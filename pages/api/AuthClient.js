import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000',
});

export const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});
