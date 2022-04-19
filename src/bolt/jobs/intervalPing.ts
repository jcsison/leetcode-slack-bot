import axios from 'axios';
import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';

class IntervalPing {
  rule: RecurrenceSpecObjLit = { minute: [0, 30] };
  fn = async () => {
    try {
      if (process.env.APP_URL) {
        await axios(process.env.APP_URL);
        Log.info('Pinged dyno');
      } else {
        throw new Error('App URL not found');
      }
    } catch (error) {
      Log.error(error, 'Error pinging dyno');
    }
  };
  job = () => scheduleJob(this.rule, this.fn);
}

export const intervalPing = new IntervalPing().job;
