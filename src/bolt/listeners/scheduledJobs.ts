import * as Jobs from '../jobs';

export const scheduledJobs = () => {
  Jobs.intervalPing();
  Jobs.postQuestion();
};
