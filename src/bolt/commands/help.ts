import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

const help = async ({
  command: _command,
  ack,
  say
}: SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    await say("You've contacted the help command!");
    Log.info('Help command triggered');
  } catch (error) {
    Log.error(error);
  }
};

export const helpCommand = () => bolt.command('/help', help);
