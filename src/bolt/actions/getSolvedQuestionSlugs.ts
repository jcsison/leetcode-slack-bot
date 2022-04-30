import { createPath, DBKey, dbRead, DBTypeKey } from '../../lib/firebase';
import { Guard } from '../../lib/utils/helpers';
import { DBTypes, ObjectGroup } from '../../lib/utils/types';

export const getSolvedQuestionSlugs = async (channelId: string) => {
  const solvedQuestions = await dbRead<ObjectGroup<DBTypes.Question>>(
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
