import { Log } from '../../lib/utils/helpers';
import { getInstallation } from '.';

export const getToken = async (
  enterpriseId: string | undefined,
  isEnterpriseInstall: boolean,
  teamId: string
) => {
  try {
    const installation = await getInstallation({
      enterpriseId,
      isEnterpriseInstall,
      teamId
    });

    if (!installation.bot) {
      throw new Error('Error fetching bot user');
    }

    return installation.bot.token;
  } catch (e) {
    Log.error('Error fetching token');
  }
};