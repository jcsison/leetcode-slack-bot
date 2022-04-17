import * as Bolt from '@slack/bolt';
import * as dotenv from 'dotenv';
import express from 'express';

import { Default } from './lib/utils/types';
import { launchApi } from './api/launchApi';
import { launchBolt } from './bolt/launchBolt';
import { logError, logInfo } from './lib/utils/helpers';

dotenv.config();

export const app = express();

// Type cast chain is a workaround to properly import default Bolt exports
export const bolt = new (Bolt as unknown as Default<typeof Bolt>).default.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

const startApi = () => {
  const apiPort = process.env.API_PORT ?? 3001;
  app.listen(apiPort);
  launchApi();
  logInfo(`API listening on port ${apiPort}`);
};

const startBolt = async () => {
  const boltPort = process.env.BOLT_PORT ?? 3001;
  await bolt.start(boltPort);
  logInfo(`Bolt listening on port ${boltPort}`);
  launchBolt();
};

startApi();
startBolt().catch(logError);
