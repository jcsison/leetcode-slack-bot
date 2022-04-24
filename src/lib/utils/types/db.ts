export interface PostQuestion {
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
  url: string;
}
