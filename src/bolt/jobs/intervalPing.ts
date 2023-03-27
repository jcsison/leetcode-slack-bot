import axios from 'axios';
import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers/index.js';

class IntervalPing {
  rule: RecurrenceSpecObjLit = { minute: [0, 12, 24, 36, 48] };
  fn = async () => {
    try {
      if (process.env.APP_URL) {
        await axios(process.env.APP_URL);
        Log.info('Pinged bot');
      } else {
        throw new Error('App URL not found');
      }
    } catch (error) {
      Log.error(error, 'Error pinging bot');
    }
  };
  job = () => scheduleJob(this.rule, this.fn);
}

export const intervalPing = new IntervalPing().job;
