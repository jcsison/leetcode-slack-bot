import * as Bolt from '@slack/bolt';
import * as dotenv from 'dotenv';
import express from 'express';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

import { Default } from './lib/utils/types';
import { Log } from './lib/utils/helpers';
import { launchApi } from './api/launchApi';
import { launchBolt } from './bolt/launchBolt';

dotenv.config();

export const app = express();

// Type cast chain is a workaround to properly import default Bolt exports
export const bolt = new (Bolt as unknown as Default<typeof Bolt>).default.App({
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN
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

const startApi = () => {
  const apiPort = process.env.PORT ?? 3000;
  app.listen(apiPort);
  launchApi();
  Log.info(`API listening on port ${apiPort}`);
};

const startBolt = async () => {
  await bolt.start();
  launchBolt();
  Log.info('Bolt started');
};

startApi();
startBolt().catch(Log.error);
