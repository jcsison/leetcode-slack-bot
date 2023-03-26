import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers/index.js';
import { bolt } from '../../../index.js';
import { getTokenById } from '../../actions/index.js';
import { solutionPosted } from './solutionPosted.js';

const message: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({
  body,
  message
}) => {
  try {
    Log.info({ body, message });

    const token =
      body.token ?? (await getTokenById({ channelId: message.channel }));

    // Handle solutions posted as a reply to a question
    await solutionPosted(message.channel, message, token);
  } catch (error) {
    Log.error(error, 'Error receiving message');
  }
};

export const messageEvent = () => bolt.event('message', message);
