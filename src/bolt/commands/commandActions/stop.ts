import { SlashCommand } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types/index.js';
import {
  createPath,
  dbDelete,
  DBKey,
  dbRead,
  DBTypeKey
} from '../../../lib/firebase/index.js';

export const stop = async (command: SlashCommand) => {
  const channelId = command.channel_id;

  const willPost = await dbRead<DBTypes.PostQuestion>(
    createPath(DBKey.POST_QUESTION, DBTypeKey.CHANNELS, channelId)
  );

  if (!willPost) {
    return 'Daily question posting is already stopped.';
  }

  await dbDelete(
    createPath(DBKey.POST_QUESTION, DBTypeKey.CHANNELS, channelId)
  );

  return 'LeetCode Bot will now stop posting daily questions in this channel.';
};
