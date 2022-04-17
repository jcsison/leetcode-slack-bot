import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

export const getChannels = async (token: string) => {
  try {
    const data = await bolt.client.conversations.list({ token });

    const channels = data.channels?.filter(
      channel => channel.is_channel && channel.is_member
    );

    return channels;
  } catch (error) {
    Log.error(error, 'Error getting channels');
  }
};
