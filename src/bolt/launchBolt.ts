import { startCommands, startEvents, startJobs } from './listeners';

export const launchBolt = () => {
  startCommands();
  startEvents();
  startJobs();
};
