import * as Jobs from '../jobs';

export const scheduledJobs = () => {
  Jobs.postQuestion();
  Jobs.pingDyno();
};
