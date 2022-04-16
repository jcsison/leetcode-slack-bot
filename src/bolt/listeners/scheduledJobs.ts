import { postQuestionJob } from '../jobs';

export const scheduledJobs = () => {
  postQuestionJob();
};
