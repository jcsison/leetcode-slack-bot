import { Installation } from '@slack/bolt';

import {
  createPath,
  DBInstallationKey,
  DBKey,
  DBValueKey
} from '../../lib/firebase';
import { dbFindByChildKeyValue } from '../../lib/firebase/actions';

export const getInstallationByChannel = async (channelId: string) => {
  const installation = await dbFindByChildKeyValue<Installation>(
    DBKey.INSTALLATIONS,
    createPath(DBInstallationKey.INCOMING_WEBHOOK, DBValueKey.CHANNEL_ID),
    channelId
  );

  if (!installation) {
    throw new Error('Error fetching installation');
  }

  return installation;
};
