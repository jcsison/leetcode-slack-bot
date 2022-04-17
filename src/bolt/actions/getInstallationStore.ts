import { receiver } from '../..';

export const getInstallationStore = (
) => {
  if (!receiver.installer) {
    throw new Error('Error fetching installation store');
  }

  return receiver.installer.installationStore;
};
