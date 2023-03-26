import { Log } from '../../lib/utils/helpers/index.js';
import { jobs } from '../jobs/index.js';

export const startJobs = () => {
  jobs.forEach(job => job());
  Log.info('Jobs scheduled');
};
