import { Installation } from '@slack/bolt';

import {
  createPath,
  dbFindByChildKeyValue,
  DBInstallationKey,
  DBKey,
  DBValueKey
} from '../../lib/firebase/index.js';

export interface IDs {
  botId?: string;
  channelId?: string;
}

export const getInstallationById = async ({ botId, channelId }: IDs) => {
  let installation: [string, Installation<'v1' | 'v2', boolean>] | undefined;

  if (botId) {
    installation = await dbFindByChildKeyValue<Installation>(
      DBKey.INSTALLATIONS,
      createPath(DBInstallationKey.BOT, DBValueKey.USER_ID),
      botId
    );
  }

  if (channelId && !installation) {
    installation = await dbFindByChildKeyValue<Installation>(
      DBKey.INSTALLATIONS,
      createPath(DBInstallationKey.INCOMING_WEBHOOK, DBValueKey.CHANNEL_ID),
      channelId
    );
  }

  if (!installation) {
    throw new Error('Error fetching installation');
  }

  return installation;
};
