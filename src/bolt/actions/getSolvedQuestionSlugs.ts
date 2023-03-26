import { DBTypes } from '../../lib/utils/types/index.js';
import { Guard } from '../../lib/utils/helpers/index.js';
import { createPath, DBKey, dbRead, DBTypeKey } from '../../lib/firebase/index.js';

export const getSolvedQuestionSlugs = async (channelId: string) => {
  const solvedQuestions = await dbRead<Record<string, DBTypes.Question>>(
    createPath(
      DBTypeKey.CHANNELS,
      channelId,
      DBKey.QUESTIONS,
      DBTypeKey.MESSAGES
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
