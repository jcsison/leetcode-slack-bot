import { commands, scheduledJobs } from './listeners';

export const launchApp = () => {
  commands();
  scheduledJobs();
};
