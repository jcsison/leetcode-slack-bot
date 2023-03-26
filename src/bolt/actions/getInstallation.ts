import { InstallationQuery } from '@slack/bolt';

import { receiver } from '../../index.js';

export const getInstallation = async (query: InstallationQuery<boolean>) => {
  const installationStore = receiver.installer?.installationStore;

  if (!installationStore) {
    throw new Error('Error fetching installation store');
  }

  const installation = await installationStore.fetchInstallation(query);

  return installation;
};
