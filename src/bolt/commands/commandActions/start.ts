import { SlashCommand } from '@slack/bolt';

import { DBTypes } from '../../../lib/utils/types';
import {
  createPath,
  DBKey,
  dbRead,
  dbStore,
  DBTypeKey
} from '../../../lib/firebase';
import { getToken } from '../../actions';

export const start = async (command: SlashCommand) => {
  const token = await getToken(
    command.enterprise_id,
    !!command.is_enterprise_install,
    command.team_id
  );

  const channelId = command.channel_id;

  const postQuestionToken = await dbRead<DBTypes.PostQuestion>(
    createPath(DBTypeKey.CHANNELS, channelId, DBKey.POST_QUESTION)
  );

  if (!!postQuestionToken) {
    return 'LeetCode Bot is already posting daily questions in this channel.';
  }

  const postChannel: DBTypes.PostQuestion = {
    token
  };

  await dbStore(
    createPath(DBTypeKey.CHANNELS, channelId, DBKey.POST_QUESTION),
    postChannel
  );

  return 'LeetCode Bot will now post daily questions in this channel.';
};
