import { startCommands, startEvents, startJobs } from './listeners/index.js';

export const launchBolt = () => {
  startCommands();
  startEvents();
  startJobs();
};
