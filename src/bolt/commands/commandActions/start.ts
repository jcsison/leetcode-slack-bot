import { SlashCommand } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import {
  createPath,
  DBKey,
  dbRead,
  dbStore,
  DBTypeKey
} from '../../../lib/firebase';
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

    const postChannelToken = await dbRead<DBTypes.PostChannel>(
      createPath(DBKey.POST_CHANNELS, DBTypeKey.CHANNELS, channelId)
    );

    if (!!postChannelToken) {
      return 'LeetCode Bot is already posting daily questions in this channel.';
    }

    const postChannel: DBTypes.PostChannel = {
      token
    };

    await dbStore(
      createPath(DBKey.POST_CHANNELS, DBTypeKey.CHANNELS, channelId),
      postChannel
    );

    return 'LeetCode Bot will now post daily questions in this channel.';
  } catch (error) {
    Log.error(error, 'Error starting daily questions');
  }
};
