import {
  FileInstallationStore,
  Installation,
  InstallationQuery
} from '@slack/bolt';

import { Log } from '../../lib/utils/helpers';
import { dbDelete, DBKey, dbStore } from '../../lib/firebase';
import { dbUnsafeRead } from '../../lib/firebase/actions';

export class LCFileInstallationStore extends FileInstallationStore {
  storeInstallation = async (installation: Installation) => {
    try {
      if (installation.isEnterpriseInstall && installation.enterprise?.id) {
        await dbStore(
          DBKey.INSTALLATION + installation.enterprise.id,
          JSON.parse(JSON.stringify(installation))
        );
      } else if (installation.team?.id) {
        await dbStore(
          DBKey.INSTALLATION + installation.team.id,
          JSON.parse(JSON.stringify(installation))
        );
      }
    } catch (error) {
      Log.error(error, 'Error storing installation');
    }
  };
  fetchInstallation = async (query: InstallationQuery<boolean>) => {
    try {
      if (query.isEnterpriseInstall && query.enterpriseId) {
        return await dbUnsafeRead<Installation>(
          DBKey.INSTALLATION + query.enterpriseId
        );
      } else if (query.teamId) {
        return await dbUnsafeRead<Installation>(
          DBKey.INSTALLATION + query.teamId
        );
      } else {
        throw new Error('Enterprise ID and team ID not found');
      }
    } catch (error) {
      Log.error(error, 'Error reading installation');
      return dbUnsafeRead<Installation>('');
    }
  };
  deleteInstallation = async (query: InstallationQuery<boolean>) => {
    try {
      if (query.isEnterpriseInstall && query.enterpriseId) {
        await dbDelete(query.enterpriseId);
      } else if (query.teamId) {
        await dbDelete(query.teamId);
      } else {
        throw new Error('Enterprise ID and team ID not found');
      }
    } catch (error) {
      Log.error(error, 'Error reading installation');
    }
  };
}
