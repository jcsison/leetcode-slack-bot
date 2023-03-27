import { CommandAction } from '../helper.js';
import { LeetCodeTypes } from '../../../lib/utils/types/index.js';

const commands: LeetCodeTypes.CommandInfo[] = [
  {
    command: '/help',
    description: 'Displays a list of commands'
  },
  {
    command: '/roll',
    description: 'Roll a new LeetCode problem'
  },
  {
    command: '/reroll',
    description:
      'Rerolls the last posted LeetCode problem (if it has no replies)'
  },
  {
    command: '/delete',
    description:
      'Deletes the last posted LeetCode problem (if it has no replies)'
  },
  {
    command: '/start',
    description: 'Starts posting daily LeetCode problems to channel'
  },
  {
    command: '/stop',
    description: 'Stops posting daily LeetCode problems to channel'
  },
  {
    command: '/list',
    description: 'Lists available problem filters'
  }
];

const reactions: LeetCodeTypes.ReactionInfo[] = [
  {
    reaction: '❌',
    description: 'Delete bot message'
  }
];

const helpString =
  '```\n' +
  'Commands:\n' +
  commands
    .map(command => `  ${command.command} - ${command.description}`)
    .join('\n') +
  '\n\nReactions:\n' +
  reactions
    .map(reaction => `  ${reaction.reaction} - ${reaction.description}`)
    .join('\n') +
  '\n```';
  ;

export const help: CommandAction<string> = () => helpString;
