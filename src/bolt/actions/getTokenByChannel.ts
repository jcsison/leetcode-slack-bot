import { getInstallationByChannel } from './index.js';

export const getTokenByChannel = async (channelId: string) => {
  const installation = await getInstallationByChannel(channelId);

  if (!installation[1].bot) {
    throw new Error('Error fetching bot user');
  }

  return installation[1].bot.token;
};
