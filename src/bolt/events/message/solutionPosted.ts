import { FileShareMessageEvent } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types';
import { createObjectGroup, Log } from '../../../lib/utils/helpers';
import { addReaction, getMessage } from '../../actions';
import {
  convertToPathTs,
  createPath,
  DBKey,
  DBQuestionKey,
  dbRead,
  dbStore,
  DBTypeKey
} from '../../../lib/firebase';
import { parseHandleFromMessage, parseUrlFromMessage } from '../../utils';
import { Message } from '@slack/web-api/dist/response/ChatPostMessageResponse';

export const solutionPosted = async (
  channelId: string,
  message: FileShareMessageEvent | Message,
  token: string
) => {
  try {
    if (!message.thread_ts || !message.ts || !message.user) {
      throw new Error('Invalid solution');
    }

    const submittedSolution: DBTypes.SubmittedSolution = {
      messageTs: message.ts,
      questionTs: message.thread_ts,
      userId: message.user
    };

    const questionDB = await dbRead<DBTypes.Question>(
      createPath(
        DBKey.QUESTIONS,
        DBTypeKey.CHANNELS,
        channelId,
        DBTypeKey.MESSAGES,
        convertToPathTs(message.thread_ts)
      )
    );

    if (questionDB) {
      await dbStore(
        createPath(
          DBKey.QUESTIONS,
          DBTypeKey.CHANNELS,
          channelId,
          DBTypeKey.MESSAGES,
          convertToPathTs(message.thread_ts),
          DBQuestionKey.SUBMITTED_SOLUTIONS,
          DBTypeKey.USERS,
          message.user
        ),
        submittedSolution
      );
    } else {
      const questionMessage = await getMessage(
        message.thread_ts,
        channelId,
        token
      );

      if (!questionMessage?.ts) {
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
        submittedSolutions: createObjectGroup(
          'users',
          createObjectGroup(message.user, submittedSolution)
        ),
        url: questionUrl
      };

      await dbStore(
        createPath(
          DBKey.QUESTIONS,
          DBTypeKey.CHANNELS,
          channelId,
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
    }

    await addReaction('white_check_mark', channelId, message.ts, token);

    Log.info('Solution posted');
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
