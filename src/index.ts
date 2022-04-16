import * as Bolt from '@slack/bolt';
import * as dotenv from 'dotenv';

import { launchApp } from './bolt/launchApp';

interface BoltDefault {
  default: typeof Bolt;
}

dotenv.config();

// Type cast chain is a workaround to properly import default Bolt exports
export const app = new (Bolt as unknown as BoltDefault).default.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

const start = async () => {
  await app.start(process.env.PORT ?? 3000);
};

start().then(launchApp);
