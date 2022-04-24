import { Installation } from '@slack/bolt';

import { Log } from '../../lib/utils/helpers';
import { createPath, DBInstallationKey, DBKey } from '../../lib/firebase';
import { dbFindByChildKeyValue } from '../../lib/firebase/actions';

export const getInstallationByChannel = async (channelId: string) => {
  try {
    const installation = await dbFindByChildKeyValue<Installation>(
      DBKey.INSTALLATIONS,
      createPath(DBInstallationKey.INCOMING_WEBHOOK, 'channelId'),
      channelId
    );

    if (!installation) {
      throw new Error('Error fetching installation');
    }

    return installation;
  } catch (error) {
    Log.error('Error fetching installation');
  }
};