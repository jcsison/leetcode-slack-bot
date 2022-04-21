import { SlashCommand } from '@slack/bolt';

import { DBKey, dbRead, dbStore } from '../../../lib/firebase';
import { Log } from '../../../lib/utils/helpers';
import { getToken } from '../../actions';

export const start = async (command: SlashCommand) => {
  try {
    const token = await getToken(
      command.enterprise_id,
      !!command.is_enterprise_install,
      command.team_id
    );

    if (!token) {
      throw new Error('Error fetching token');
    }

    const channelId = command.channel_id;

    const postChannelToken = await dbRead<string>(
      DBKey.POST_CHANNEL + channelId
    );

    if (!!postChannelToken) {
      return 'LeetCode Bot is already posting daily questions in this channel.';
    }

    await dbStore(DBKey.POST_CHANNEL + channelId, token);

    return 'LeetCode Bot will now post daily questions in this channel.';
  } catch (error) {
    Log.error(error, 'Error starting daily questions');
  }
};