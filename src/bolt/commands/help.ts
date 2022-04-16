import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { app } from '../..';
import { logError, logInfo } from '../../lib/utils/helpers';

const help = async ({
  command: _command,
  ack,
  say
}: SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    say("You've contacted the help command!");
    logInfo('Help command triggered');
  } catch (error) {
    logError(error);
  }
};

export const helpCommand = () => app.command('/help', help);
