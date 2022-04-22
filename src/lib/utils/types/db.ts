import { ObjectGroup } from './common';

export interface PostChannel {
  token: string;
}

export interface SubmittedSolution {
  messageTs: string;
  questionTs: string;
  userId: string;
}

export interface Question {
  handle: string;
  messageTs: string;
  submittedSolution: ObjectGroup<SubmittedSolution>;
  url: string;
}
