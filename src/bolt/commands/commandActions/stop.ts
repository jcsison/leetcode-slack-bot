import { SlashCommand } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import {
  createPath,
  dbDelete,
  DBKey,
  dbRead,
  DBTypeKey
} from '../../../lib/firebase';

export const stop = async (command: SlashCommand) => {
  try {
    const channelId = command.channel_id;

    const willPost = await dbRead<DBTypes.PostQuestion>(
      createPath(DBTypeKey.CHANNELS, channelId, DBKey.POST_QUESTION)
    );

    if (!willPost) {
      return 'Daily question posting is already stopped.';
    }

    await dbDelete(
      createPath(DBTypeKey.CHANNELS, channelId, DBKey.POST_QUESTION)
    );

    return 'LeetCode Bot will now stop posting daily questions in this channel.';
  } catch (error) {
    Log.error(error, 'Error starting daily questions');
  }
};
