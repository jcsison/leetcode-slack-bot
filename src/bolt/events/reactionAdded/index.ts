import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers/index.js';
import { bolt } from '../../../index.js';
import { deleteReact } from './deleteReact.js';
import { questionReact } from './questionReact.js';

const reactionAdded: Middleware<
  SlackEventMiddlewareArgs<'reaction_added'>
> = async ({ payload }) => {
  try {
    Log.info(payload);

    await deleteReact(payload);
    await questionReact(payload);
  } catch (error) {
    Log.error(error, 'Error receiving reaction');
  }
};

export const reactionAddedEvent = () =>
  bolt.event('reaction_added', reactionAdded);
