import * as Bolt from '@slack/bolt';
import * as dotenv from 'dotenv';
import express from 'express';

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
