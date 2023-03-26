import { ReactionAddedEvent } from '@slack/bolt';
import { bolt } from '../../../index.js';

import { getBotId, getTokenByChannel } from '../../actions/index.js';

export const deleteReact = async (payload: ReactionAddedEvent) => {
  const message = payload.item;

  if (message.type === 'message') {
    const token = await getTokenByChannel(payload.item.channel);

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
