import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers/index.js';
import { bolt } from '../../../index.js';
import { chatGPTReply } from './chatGPTReply.js';
import { getTokenById } from '../../actions/getTokenById.js';
import { solutionPosted } from './solutionPosted.js';

const message: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({
  body,
  message
}) => {
  try {
    Log.info(message);

    const token = await getTokenById({ teamId: body.team_id });

    await chatGPTReply(message.channel, message, token);
    await solutionPosted(message.channel, message, token);
  } catch (error) {
    Log.error(error, 'Error receiving message');
  }
};

export const messageEvent = () => bolt.event('message', message);
