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
  dbStore
} from '../../../lib/firebase';
import { parseHandleFromMessage, parseUrlFromMessage } from '../../utils';

export const solutionPosted = async (
  message: FileShareMessageEvent,
  token: string
) => {
  try {
    if (!message.thread_ts) {
      throw new Error('Invalid solution');
    }

    const submittedSolution: DBTypes.SubmittedSolution = {
      messageTs: message.ts,
      questionTs: message.thread_ts,
      userId: message.user
    };

    const questionDB = await dbRead<DBTypes.Question>(
      createPath(
        DBKey.QUESTION,
        message.channel,
        convertToPathTs(message.thread_ts)
      )
    );

    if (questionDB) {
      await dbStore(
        createPath(
          DBKey.QUESTION,
          message.channel,
          convertToPathTs(message.thread_ts),
          DBQuestionKey.SUBMITTED_SOLUTION,
          message.user
        ),
        submittedSolution
      );
    } else {
      const questionMessage = await getMessage(
        message.thread_ts,
        message.channel,
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
        submittedSolution: createObjectGroup(message.user, submittedSolution),
        url: questionUrl
      };

      await dbStore(
        createPath(
          DBKey.QUESTION,
          message.channel,
          convertToPathTs(message.thread_ts)
        ),
        question
      );

      await addReaction(
        'heavy_check_mark',
        message.channel,
        message.thread_ts,
        token
      );
    }

    await addReaction('white_check_mark', message.channel, message.ts, token);

    Log.info('Solution posted');
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
