import {
  FileInstallationStore,
  Installation,
  InstallationQuery
} from '@slack/bolt';

import { Guard, Log, parseJSON } from '../../lib/utils/helpers/index.js';
import {
  createPath,
  dbDelete,
  DBKey,
  dbStore,
  dbUnsafeRead
} from '../../lib/firebase/index.js';

export class LCFileInstallationStore extends FileInstallationStore {
  storeInstallation = async (installation: Installation) => {
    try {
      if (installation.isEnterpriseInstall && installation.enterprise?.id) {
        await dbStore(
          createPath(DBKey.INSTALLATIONS, installation.enterprise.id),
          parseJSON(JSON.stringify(installation), Guard.string)
        );
      } else if (installation.team?.id) {
        await dbStore(
          createPath(DBKey.INSTALLATIONS, installation.team.id),
          parseJSON(JSON.stringify(installation), Guard.string)
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
          createPath(DBKey.INSTALLATIONS, query.enterpriseId)
        );
      } else if (query.teamId) {
        return await dbUnsafeRead<Installation>(
          createPath(DBKey.INSTALLATIONS, query.teamId)
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
        await dbDelete(createPath(DBKey.INSTALLATIONS, query.enterpriseId));
      } else if (query.teamId) {
        await dbDelete(createPath(DBKey.INSTALLATIONS, query.teamId));
      } else {
        throw new Error('Enterprise ID and team ID not found');
      }
    } catch (error) {
      Log.error(error, 'Error reading installation');
    }
  };
}
