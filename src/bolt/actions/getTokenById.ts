import { IDs } from './getInstallationById.js';
import { getInstallationById } from './index.js';

export const getTokenById = async (ids: IDs) => {
  const installation = await getInstallationById(ids);

  if (!installation[1].bot) {
    throw new Error('Error fetching bot user');
  }

  return installation[1].bot.token;
};
