import * as Jobs from '../jobs';
import { Log } from '../../lib/utils/helpers';

export const scheduledJobs = () => {
  Jobs.intervalPing();
  Jobs.postQuestion();

  Log.info('Jobs scheduled');
};
