import { FileShareMessageEvent } from '@slack/bolt';
import { Message } from '@slack/web-api/dist/response/ChatPostMessageResponse';

import { DBTypes } from '../../../lib/utils/types/index.js';
import { Guard, Log } from '../../../lib/utils/helpers/index.js';
import {
  addReaction,
  getMessage,
  removeReaction
} from '../../actions/index.js';
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
} from '../../../lib/firebase/index.js';
import {
  parseHandleFromMessage,
  parseUrlFromMessage
} from '../../utils/index.js';
import { validateLeetCodeUrl } from '../../../lib/dataSource/leetcode/index.js';

export const solutionPosted = async (
  channelId: string,
  message: FileShareMessageEvent | Message,
  token: string
) => {
  try {
    const fileShareMessage = Guard.validate(
      message,
      Guard.object<FileShareMessageEvent>('subtype')
    );

    if (fileShareMessage?.subtype === 'file_share' && fileShareMessage.thread_ts) {
      const parentMessage = await getMessage(
        fileShareMessage.thread_ts,
        fileShareMessage.channel,
        token
      );

      if (validateLeetCodeUrl(parentMessage.text)) {
        if (!fileShareMessage.thread_ts || !fileShareMessage.ts || !fileShareMessage.user) {
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
            createFilter(fileShareMessage.user, fileShareMessage.thread_ts)
          )
        )?.[1];

        if (previouslySubmittedSolution) {
          if (previouslySubmittedSolution.messageTs === message.ts) {
            Log.info('Solution already added to db');
            return;
          } else {
            await dbDelete(
              createPath(
                DBTypeKey.CHANNELS,
                channelId,
                DBKey.SUBMITTED_SOLUTIONS,
                DBTypeKey.MESSAGES,
                convertToPathTs(previouslySubmittedSolution.messageTs)
              )
            );

            await removeReaction(
              'white_check_mark',
              channelId,
              fileShareMessage.ts,
              token
            );

            Log.info('Previous solution removed from db');
          }
        }

        const submittedSolution: DBTypes.SubmittedSolution = {
          _filters: {
            userId_questionId: createFilter(fileShareMessage.user, fileShareMessage.thread_ts)
          },
          messageTs: fileShareMessage.ts,
          questionTs: fileShareMessage.thread_ts,
          userId: fileShareMessage.user
        };

        const questionDB = await dbRead<DBTypes.Question>(
          createPath(
            DBTypeKey.CHANNELS,
            channelId,
            DBKey.QUESTIONS,
            DBTypeKey.MESSAGES,
            convertToPathTs(fileShareMessage.thread_ts)
          )
        );

        if (questionDB) {
          await dbStore(
            createPath(
              DBTypeKey.CHANNELS,
              channelId,
              DBKey.SUBMITTED_SOLUTIONS,
              DBTypeKey.MESSAGES,
              convertToPathTs(fileShareMessage.ts)
            ),
            submittedSolution
          );
        } else {
          const questionMessage = await getMessage(
            fileShareMessage.thread_ts,
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
              convertToPathTs(fileShareMessage.thread_ts)
            ),
            question
          );

          await addReaction(
            'heavy_check_mark',
            channelId,
            fileShareMessage.thread_ts,
            token
          );

          Log.info('Question added to db');

          await dbStore(
            createPath(
              DBTypeKey.CHANNELS,
              channelId,
              DBKey.SUBMITTED_SOLUTIONS,
              DBTypeKey.MESSAGES,
              convertToPathTs(fileShareMessage.ts)
            ),
            submittedSolution
          );
        }

        await addReaction('white_check_mark', channelId, fileShareMessage.ts, token);

        Log.info('Solution added to db');
      } else {
        throw new Error('Error validating url');
      }
    }
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
