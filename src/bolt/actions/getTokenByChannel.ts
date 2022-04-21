import { Log } from '../../lib/utils/helpers';
import { getInstallationByChannel } from './getInstallationByChannel';

export const getTokenByChannel = async (channelId: string) => {
  try {
    const installation = await getInstallationByChannel(channelId);

    if (!installation?.[1]) {
      throw new Error('Error fetching installation');
    }

    if (!installation[1].bot) {
      throw new Error('Error fetching bot user');
    }

    return installation[1].bot.token;
  } catch (e) {
    Log.error('Error fetching token');
  }
};
