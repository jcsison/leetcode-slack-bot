import axios from 'axios';
import { RecurrenceRule, scheduleJob } from 'node-schedule';

import { logError, logInfo } from '../../lib/utils/helpers';

const rule = new RecurrenceRule();
rule.minute = [0, 30];

const intervalPingFunc = async () => {
  try {
    if (process.env.APP_URL) {
      await axios(process.env.APP_URL);
      logInfo('Pinged dyno');
    } else {
      throw new Error('App URL not found');
    }
  } catch (error) {
    logError('Error pinging dyno');
  }
};

export const intervalPing = () => scheduleJob(rule, intervalPingFunc);
