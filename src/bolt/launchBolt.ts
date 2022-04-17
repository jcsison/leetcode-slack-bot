import { commands, scheduledJobs } from './listeners';

export const launchBolt = () => {
  commands();
  scheduledJobs();
};
