import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { bolt } from '../../..';
import { getMessage, getTokenByChannel } from '../../actions';
import { solutionPosted } from './solutionPosted';
import { validateLeetCodeUrl } from '../../../lib/dataSource/leetcode';

const message: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({
  message
}) => {
  try {
    Log.info(message);
    const token = await getTokenByChannel(message.channel);

    if (!token) {
      throw new Error('Error fetching token');
    }

    // Handle solutions posted as a reply to a question
    if (message.subtype === 'file_share' && message.thread_ts) {
      const parentMessage = await getMessage(
        message.thread_ts,
        message.channel,
        token
      );

      if (!parentMessage) {
        throw new Error('Error fetching parent message');
      }

      if (validateLeetCodeUrl(parentMessage.text)) {
        return await solutionPosted(message, token);
      }
    }
  } catch (error) {
    Log.error(error, 'Error receiving message');
  }
};

export const messageEvent = () => bolt.event('message', message);
