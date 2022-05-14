import { DBTypes } from '../../lib/utils/types';
import { Guard } from '../../lib/utils/helpers';
import { createPath, DBKey, dbRead, DBTypeKey } from '../../lib/firebase';

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
