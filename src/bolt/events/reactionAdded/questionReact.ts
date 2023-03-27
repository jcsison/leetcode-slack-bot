import { ReactionAddedEvent } from '@slack/bolt';

import { getMessage, getMessageReply } from '../../actions/index.js';
import { solutionPosted } from '../message/solutionPosted.js';
import { validateLeetCodeUrl } from '../../../lib/dataSource/leetcode/index.js';

export const questionReact = async (
  token: string,
  payload: ReactionAddedEvent
) => {
  if (
    payload.reaction === 'white_check_mark' &&
    payload.item.type === 'message'
  ) {
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
        await solutionPosted(payload.item.channel, message, token);
      } else {
        throw new Error('Error validating url');
      }
    }
  }
};
