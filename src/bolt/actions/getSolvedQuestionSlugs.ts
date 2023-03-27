import { DBTypes } from '../../lib/utils/types/index.js';
import { Guard } from '../../lib/utils/helpers/index.js';
import {
  createPath,
  dbRead,
  DB_KEY,
  DB_TYPE_KEY
} from '../../lib/firebase/index.js';

export const getSolvedQuestionSlugs = async (channelId: string) => {
  const solvedQuestions = await dbRead<Record<string, DBTypes.Question>>(
    createPath(
      DB_TYPE_KEY.CHANNELS,
      channelId,
      DB_KEY.QUESTIONS,
      DB_TYPE_KEY.MESSAGES
    )
  );

  if (!solvedQuestions) {
    return [];
  }

  const questionUrls = Object.values(solvedQuestions)
    .map(question => question?.handle)
    .filter(Guard.string);

  return questionUrls;
};
