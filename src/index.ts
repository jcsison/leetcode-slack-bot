import * as dotenv from 'dotenv';
import Bolt from '@slack/bolt';
import admin from 'firebase-admin';

import { LCFileInstallationStore } from './bolt/utils/LCFileInstallationStore';
import { Log } from './lib/utils/helpers';
import { launchApi } from './api/launchApi';
import { launchBolt } from './bolt/launchBolt';

dotenv.config();

export const receiver = new Bolt.ExpressReceiver({
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
    'links:read',
    'links:write',
    'mpim:read',
    'reactions:read',
    'reactions:write',
    'reminders:read',
    'reminders:write',
    'users:read'
  ],
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  stateSecret: process.env.SLACK_STATE_SECRET
});

export const bolt = new Bolt.App({
  receiver
});

export const firebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
      : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROCESS_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const db = admin.database();

const startBolt = async () => {
  const port = process.env.PORT ?? 3000;
  await bolt.start(port);
  Log.info(`Bolt listening on port ${port}`);
  launchApi();
  launchBolt();
};

bolt.error((error: Bolt.CodedError) => new Promise(() => Log.error(error)));

bolt.message('knock knock', async ({ say }) => {
  await say("_Who's there?_");
});

startBolt().catch(Log.error);
