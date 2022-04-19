import { Log } from '../../lib/utils/helpers';
import { jobs } from '../jobs';

export const scheduledJobs = () => {
  jobs.forEach(job => job());
  Log.info('Jobs scheduled');
};
