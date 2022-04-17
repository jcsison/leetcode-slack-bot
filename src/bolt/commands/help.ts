import { command } from './helper';

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
  '*Commands*:\n' +
  commands
    .map(command => `\`${command.command}\`: ${command.description}`)
    .join('\n');

const help = () => commandString;

export const helpCommand = command('/help', help);
