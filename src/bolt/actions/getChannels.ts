import { app } from '../..';
import { logError } from '../../lib/utils/helpers';

export const getChannels = async () => {
  try {
    const data = await app.client.conversations.list();

    const channels = data.channels?.filter(
      channel => channel.is_channel && channel.is_member
    );

    return channels;
  } catch (error) {
    logError(error, 'Error getting channels');
  }
};
