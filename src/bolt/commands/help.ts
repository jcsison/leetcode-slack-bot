import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

interface CommandInfo {
  command: string;
  description: string;
}

const commands: CommandInfo[] = [
  {
    command: '/help',
    description: 'Displays a list of commands'
  },
  {
    command: '/roll',
    description: 'Roll a new LeetCode problem'
  }
];

const commandString =
  'Commands:\n' +
  commands
    .map(command => `*${command.command}*: ${command.description}`)
    .join('\n');

const help = async ({ ack, say }: SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    await say(commandString);
    Log.info('Help command triggered');
  } catch (error) {
    Log.error(error);
  }
};

export const helpCommand = () => bolt.command('/help', help);
