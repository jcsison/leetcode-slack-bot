import axios from 'axios';
import { RecurrenceRule, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';

const rule = new RecurrenceRule();
rule.minute = [0, 30];

const intervalPingFunc = async () => {
  try {
    if (process.env.APP_URL) {
      await axios(process.env.APP_URL);
      Log.info('Pinged dyno');
    } else {
      throw new Error('App URL not found');
    }
  } catch (error) {
    Log.error('Error pinging dyno');
  }
};

export const intervalPing = () => scheduleJob(rule, intervalPingFunc);
