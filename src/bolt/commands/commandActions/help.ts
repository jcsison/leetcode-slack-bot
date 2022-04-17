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
  },
  {
    command: '/reroll',
    description: 'Rerolls the last LeetCode problem'
  }
];

const commandString =
  '*Commands*:\n' +
  commands
    .map(command => `\`${command.command}\`: ${command.description}`)
    .join('\n');

export const help = () => commandString;
