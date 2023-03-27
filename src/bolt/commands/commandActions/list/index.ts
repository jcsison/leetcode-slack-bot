import { CommandAction } from '../../helper.js';
import { LeetCodeTypes } from '../../../../lib/utils/types/index.js';
import { companyTagsText } from './companyTagsText.js';
import { topicTagsText } from './topicTagsText.js';

const LIST_COMMANDS = {
  COMPANIES: 'companies',
  TOPICS: 'topics'
} as const;

const commands: LeetCodeTypes.CommandInfo[] = [
  {
    command: LIST_COMMANDS.TOPICS,
    description: 'List available topic tags'
  },
  {
    command: LIST_COMMANDS.COMPANIES,
    description: 'List available company tags'
  }
];

const helpString = () =>
  '```\n' +
  'Usage: /list [type] [page]\n' +
  commands
    .map(command => `  ${command.command} - ${command.description}`)
    .join('\n') +
  '\n```';

export const list: CommandAction<string> = async ({ command }) => {
  const paramArray = command.text.trim().split(/\s+/);
  const type = paramArray[0] ?? '';
  const page = Number(paramArray[1]) || 1;

  switch (type) {
    case LIST_COMMANDS.COMPANIES:
      const awaitedCompanyTagsText = await companyTagsText(page);
      return awaitedCompanyTagsText;
    case LIST_COMMANDS.TOPICS:
      return topicTagsText(page);
    default:
      return helpString();
  }
};
