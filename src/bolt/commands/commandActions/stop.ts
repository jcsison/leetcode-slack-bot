import { SlashCommand } from '@slack/bolt';

import { CommandAction } from '../helper.js';
import { DBTypes } from '../../../lib/utils/types/index.js';
import {
  createPath,
  dbDelete,
  dbRead,
  DB_KEY,
  DB_TYPE_KEY
} from '../../../lib/firebase/index.js';

export const stop: CommandAction = async (command: SlashCommand) => {
  const channelId = command.channel_id;

  const willPost = await dbRead<DBTypes.PostQuestion>(
    createPath(DB_KEY.POST_QUESTION, DB_TYPE_KEY.CHANNELS, channelId)
  );

  if (!willPost) {
    return 'Daily question posting is already stopped.';
  }

  await dbDelete(
    createPath(DB_KEY.POST_QUESTION, DB_TYPE_KEY.CHANNELS, channelId)
  );

  return 'LeetCode Bot will now stop posting daily questions in this channel.';
};
