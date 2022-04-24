import { FileShareMessageEvent } from '@slack/bolt';
import { Message } from '@slack/web-api/dist/response/ChatPostMessageResponse';

import { DBTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import { addReaction, getMessage } from '../../actions';
import {
  convertToPathTs,
  createPath,
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

    const submittedSolution: DBTypes.SubmittedSolution = {
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

      Log.info('Question posted');
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
