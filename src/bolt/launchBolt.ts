import { scheduledJobs, startCommands } from './listeners';

export const launchBolt = () => {
  startCommands();
  scheduledJobs();
};
