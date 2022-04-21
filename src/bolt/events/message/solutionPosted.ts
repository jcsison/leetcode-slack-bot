import { FileShareMessageEvent } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { bolt } from '../../..';

export const solutionPosted = async (
  message: FileShareMessageEvent,
  token: string
) => {
  try {
    await bolt.client.reactions.add({
      channel: message.channel,
      name: 'white_check_mark',
      token,
      timestamp: message.ts
    });

    Log.info('Solution posted');
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
