import { Installation } from '@slack/bolt';

import { DBInstallationKey, DBKey } from '../../lib/firebase';
import { Log } from '../../lib/utils/helpers';
import { dbFindByChildKeyValue } from '../../lib/firebase/actions';

export const getInstallationByChannel = async (channelId: string) => {
  try {
    const installation = await dbFindByChildKeyValue<Installation>(
      DBKey.INSTALLATION,
      DBInstallationKey.INCOMING_WEBHOOK + 'channelId',
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
