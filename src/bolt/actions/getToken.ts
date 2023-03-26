import { getInstallation } from './index.js';

export const getToken = async (
  enterpriseId: string | undefined,
  isEnterpriseInstall: boolean,
  teamId: string
) => {
  const installation = await getInstallation({
    enterpriseId,
    isEnterpriseInstall,
    teamId
  });

  if (!installation.bot) {
    throw new Error('Error fetching bot user');
  }

  return installation.bot.token;
};
