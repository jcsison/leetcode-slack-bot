import { Installation } from '@slack/bolt';

import {
  createPath,
  DBInstallationKey,
  DBKey,
  DBValueKey
} from '../../lib/firebase';
import { dbFindByChildKeyValue } from '../../lib/firebase/actions';

export const getInstallationByChannel = (channelId: string) => {
  return dbFindByChildKeyValue<Installation>(
    DBKey.INSTALLATIONS,
    createPath(DBInstallationKey.INCOMING_WEBHOOK, DBValueKey.CHANNEL_ID),
    channelId
  );
};
