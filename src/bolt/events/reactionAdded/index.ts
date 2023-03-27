import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers/index.js';
import { bolt } from '../../../index.js';
import { deleteReact } from './deleteReact.js';
import { getTokenById } from '../../actions/getTokenById.js';
import { questionReact } from './questionReact.js';

const reactionAdded: Middleware<
  SlackEventMiddlewareArgs<'reaction_added'>
> = async ({ body, payload }) => {
  try {
    Log.info(payload);

    const token = await getTokenById({ teamId: body.team_id });

    await deleteReact(token, payload);
    await questionReact(token, payload);
  } catch (error) {
    Log.error(error, 'Error receiving reaction');
  }
};

export const reactionAddedEvent = () =>
  bolt.event('reaction_added', reactionAdded);
