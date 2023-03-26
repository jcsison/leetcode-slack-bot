import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';
import { getMessage, getMessageReply, getTokenByChannel } from '../actions/index.js';
import { solutionPosted } from './message/solutionPosted.js';
import { validateLeetCodeUrl } from '../../lib/dataSource/leetcode/index.js';

const reactionAdded: Middleware<
  SlackEventMiddlewareArgs<'reaction_added'>
> = async ({ payload }) => {
  try {
    Log.info(payload);

    if (payload.item.type === 'message') {
      const token = await getTokenByChannel(payload.item.channel);

      const message = await getMessageReply(
        payload.item.ts,
        payload.item.channel,
        token
      );

      // Handle solutions posted as a reply to a question
      if (message.files && message.thread_ts) {
        const parentMessage = await getMessage(
          message.thread_ts,
          payload.item.channel,
          token
        );

        if (validateLeetCodeUrl(parentMessage.text)) {
          return await solutionPosted(payload.item.channel, message, token);
        } else {
          throw new Error('Error validating url');
        }
      }
    }
  } catch (error) {
    Log.error(error, 'Error receiving reaction');
  }
};

export const reactionAddedEvent = () =>
  bolt.event('reaction_added', reactionAdded);
