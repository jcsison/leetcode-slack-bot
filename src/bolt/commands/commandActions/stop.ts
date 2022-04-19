import { SlashCommand } from '@slack/bolt';
import { dbDelete, DBKey, dbRead } from '../../../lib/firebase';

import { Log } from '../../../lib/utils/helpers';

export const stop = async (command: SlashCommand) => {
  try {
    const channelId = command.channel_id;

    const willPost = await dbRead<boolean>(DBKey.POST_CHANNEL + channelId);

    if (!willPost) {
      return 'Daily question posting is already stopped.';
    }

    await dbDelete(DBKey.POST_CHANNEL + channelId);

    return 'LeetCode Bot will now stop posting daily questions in this channel.';
  } catch (error) {
    Log.error(error, 'Error starting daily questions');
  }
};
