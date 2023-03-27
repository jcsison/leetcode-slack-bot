import { CommandAction } from '../helper.js';
import { DBTypes } from '../../../lib/utils/types/index.js';
import {
  createPath,
  dbRead,
  dbStore,
  DB_KEY,
  DB_TYPE_KEY
} from '../../../lib/firebase/index.js';

export const start: CommandAction<string> = async ({ command }, token) => {
  const channelId = command.channel_id;

  const postQuestionToken = await dbRead<DBTypes.PostQuestion>(
    createPath(DB_KEY.POST_QUESTION, DB_TYPE_KEY.CHANNELS, channelId)
  );

  if (!!postQuestionToken) {
    return 'LeetCode Bot is already posting daily questions in this channel.';
  }

  const postChannel: DBTypes.PostQuestion = {
    token
  };

  await dbStore(
    createPath(DB_KEY.POST_QUESTION, DB_TYPE_KEY.CHANNELS, channelId),
    postChannel
  );

  return 'LeetCode Bot will now post daily questions in this channel.';
};
