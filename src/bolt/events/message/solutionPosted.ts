import { FileShareMessageEvent } from '@slack/bolt';
import { Message } from '@slack/web-api/dist/response/ChatPostMessageResponse';

import { DBTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import { addReaction, getMessage, removeReaction } from '../../actions';
import {
  convertToPathTs,
  createFilter,
  createPath,
  dbDelete,
  DBFilterKey,
  dbFindByChildKeyValue,
  DBKey,
  dbRead,
  dbStore,
  DBTypeKey
} from '../../../lib/firebase';
import { parseHandleFromMessage, parseUrlFromMessage } from '../../utils';

export const solutionPosted = async (
  channelId: string,
  message: FileShareMessageEvent | Message,
  token: string
) => {
  try {
    if (!message.thread_ts || !message.ts || !message.user) {
      throw new Error('Invalid solution');
    }

    const previouslySubmittedSolution = (
      await dbFindByChildKeyValue<DBTypes.SubmittedSolution>(
        createPath(
          DBTypeKey.CHANNELS,
          channelId,
          DBKey.SUBMITTED_SOLUTIONS,
          DBTypeKey.MESSAGES
        ),
        createPath(DBTypeKey.FILTERS, DBFilterKey.USER_ID_QUESTION_ID),
        createFilter(message.user, message.thread_ts)
      )
    )?.[1];

    if (previouslySubmittedSolution) {
      await dbDelete(
        createPath(
          DBTypeKey.CHANNELS,
          channelId,
          DBKey.SUBMITTED_SOLUTIONS,
          DBTypeKey.MESSAGES,
          convertToPathTs(previouslySubmittedSolution.messageTs)
        )
      );

      await removeReaction('white_check_mark', channelId, message.ts, token);

      Log.info('Previous solution removed from db');
    }

    const submittedSolution: DBTypes.SubmittedSolution = {
      _filters: {
        userId_questionId: createFilter(message.user, message.thread_ts)
      },
      messageTs: message.ts,
      questionTs: message.thread_ts,
      userId: message.user
    };

    const questionDB = await dbRead<DBTypes.Question>(
      createPath(
        DBTypeKey.CHANNELS,
        channelId,
        DBKey.QUESTIONS,
        DBTypeKey.MESSAGES,
        convertToPathTs(message.thread_ts)
      )
    );

    if (questionDB) {
      await dbStore(
        createPath(
          DBTypeKey.CHANNELS,
          channelId,
          DBKey.SUBMITTED_SOLUTIONS,
          DBTypeKey.MESSAGES,
          convertToPathTs(message.ts)
        ),
        submittedSolution
      );
    } else {
      const questionMessage = await getMessage(
        message.thread_ts,
        channelId,
        token
      );

      if (!questionMessage.ts) {
        throw new Error('Error fetching question');
      }

      if (!questionMessage.text) {
        throw new Error('Invalid question URL');
      }

      const questionHandle = parseHandleFromMessage(questionMessage.text);
      const questionUrl = parseUrlFromMessage(questionMessage.text);

      if (!questionHandle || !questionUrl) {
        throw new Error('Error parsing question url');
      }

      const question: DBTypes.Question = {
        handle: questionHandle,
        messageTs: questionMessage.ts,
        url: questionUrl
      };

      await dbStore(
        createPath(
          DBTypeKey.CHANNELS,
          channelId,
          DBKey.QUESTIONS,
          DBTypeKey.MESSAGES,
          convertToPathTs(message.thread_ts)
        ),
        question
      );

      await addReaction(
        'heavy_check_mark',
        channelId,
        message.thread_ts,
        token
      );

      Log.info('Question added to db');

      await dbStore(
        createPath(
          DBTypeKey.CHANNELS,
          channelId,
          DBKey.SUBMITTED_SOLUTIONS,
          DBTypeKey.MESSAGES,
          convertToPathTs(message.ts)
        ),
        submittedSolution
      );
    }

    await addReaction('white_check_mark', channelId, message.ts, token);

    Log.info('Solution added to db');
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
