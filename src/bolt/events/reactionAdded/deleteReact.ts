import { ReactionAddedEvent } from '@slack/bolt';
import { bolt } from '../../../index.js';

import { getBotId } from '../../actions/index.js';

export const deleteReact = async (
  token: string,
  payload: ReactionAddedEvent
) => {
  const message = payload.item;

  if (payload.reaction === 'x' && message.type === 'message') {
    const botId = await getBotId(token);

    if (payload.item_user === botId) {
      await bolt.client.chat.delete({
        channel: message.channel,
        ts: message.ts,
        token: token
      });
    }
  }
};
