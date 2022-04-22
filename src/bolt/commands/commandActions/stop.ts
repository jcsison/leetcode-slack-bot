import { SlashCommand } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import { createPath, dbDelete, DBKey, dbRead } from '../../../lib/firebase';

export const stop = async (command: SlashCommand) => {
  try {
    const channelId = command.channel_id;

    const willPost = await dbRead<DBTypes.PostChannel>(
      createPath(DBKey.POST_CHANNEL, channelId)
    );

    if (!willPost) {
      return 'Daily question posting is already stopped.';
    }

    await dbDelete(createPath(DBKey.POST_CHANNEL, channelId));

    return 'LeetCode Bot will now stop posting daily questions in this channel.';
  } catch (error) {
    Log.error(error, 'Error starting daily questions');
  }
};
