import * as dotenv from 'dotenv';
import { App, CodedError, ExpressReceiver, LogLevel } from '@slack/bolt';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';

import { LCFileInstallationStore } from './bolt/utils/LCFileInstallationStore';
import { Log } from './lib/utils/helpers';
import { launchApi } from './api/launchApi';
import { launchBolt } from './bolt/launchBolt';

dotenv.config();

export const receiver = new ExpressReceiver({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  installationStore: new LCFileInstallationStore(),
  scopes: [
    'app_mentions:read',
    'channels:history',
    'channels:join',
    'channels:read',
    'chat:write',
    'commands',
    'files:read',
    'groups:read',
    'im:read',
    'incoming-webhook',
    'mpim:read',
    'reactions:write'
  ],
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  stateSecret: process.env.SLACK_STATE_SECRET
});

export const bolt = new App({
  receiver,
  logLevel: LogLevel.DEBUG
});

export const firebase = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIREBASE_APP_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROCESS_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const db = getDatabase(firebase);

const startBolt = async () => {
  const port = process.env.PORT ?? 3000;
  await bolt.start(port);
  Log.info(`Bolt listening on port ${port}`);
  launchApi();
  launchBolt();
};

bolt.error((error: CodedError) => new Promise(() => Log.error(error)));

bolt.message('knock knock', async ({ say }) => {
  await say("_Who's there?_");
});

startBolt().catch(Log.error);
