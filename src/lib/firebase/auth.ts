import { JWT } from 'google-auth-library';

import { Log } from '../utils/helpers';

export const generateFirebaseAccessToken = async () => {
  try {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
      : undefined;

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/firebase.database'
    ];

    if (!clientEmail) {
      throw new Error('Missing client email');
    }

    if (!privateKey) {
      throw new Error('Missing private key');
    }

    const jwtClient = new JWT(clientEmail, undefined, privateKey, scopes);

    const authToken = await new Promise<string>((resolve, reject) =>
      jwtClient.authorize((error, tokens) => {
        if (error) {
          Log.error(error);
          reject('Error generating Firebase access token');
        } else if (!tokens?.access_token) {
          reject('Permission denied when generating Firebase access token');
        } else {
          resolve(tokens.access_token);
        }
      })
    );

    Log.info(authToken);
  } catch (error) {
    Log.error(error);
  }
};
