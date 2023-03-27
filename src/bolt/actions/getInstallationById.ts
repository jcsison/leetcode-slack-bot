import { Installation } from '@slack/bolt';

import {
  createPath,
  dbFindByChildKeyValue,
  DB_INSTALLATION_KEY,
  DB_KEY,
  DB_VALUE_KEY
} from '../../lib/firebase/index.js';

export interface IDs {
  botId?: string;
  channelId?: string;
  teamId?: string;
}

export const getInstallationById = async ({
  botId,
  channelId,
  teamId
}: IDs) => {
  let installation: [string, Installation<'v1' | 'v2', boolean>] | undefined;

  if (teamId) {
    installation = await dbFindByChildKeyValue<Installation>(
      DB_KEY.INSTALLATIONS,
      createPath(DB_INSTALLATION_KEY.TEAM, DB_VALUE_KEY.ID),
      teamId
    );
  }

  if (botId && !installation) {
    installation = await dbFindByChildKeyValue<Installation>(
      DB_KEY.INSTALLATIONS,
      createPath(DB_INSTALLATION_KEY.BOT, DB_VALUE_KEY.USER_ID),
      botId
    );
  }

  if (channelId && !installation) {
    installation = await dbFindByChildKeyValue<Installation>(
      DB_KEY.INSTALLATIONS,
      createPath(DB_INSTALLATION_KEY.INCOMING_WEBHOOK, DB_VALUE_KEY.CHANNEL_ID),
      channelId
    );
  }

  if (!installation) {
    throw new Error('Error fetching installation');
  }

  return installation;
};
