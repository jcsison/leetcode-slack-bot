import { SlashCommand } from '@slack/bolt';
import { Log } from '../../../../lib/utils/helpers';

import { LeetCodeTypes } from '../../../../lib/utils/types';
import { companyTagsText } from './companyTagsText';
import { topicTagsText } from './topicTagsText';

enum ListCommands {
  COMPANIES = 'companies',
  TOPICS = 'topics'
}

const commands: LeetCodeTypes.CommandInfo[] = [
  {
    command: ListCommands.TOPICS,
    description: 'List available topic tags'
  },
  {
    command: ListCommands.COMPANIES,
    description: 'List available company tags'
  }
];

const helpString = () =>
  '```\n' +
  'Usage: /list [filter] [page]\n' +
  commands
    .map(command => `  ${command.command} - ${command.description}`)
    .join('\n') +
  '\n```';

export const list = async (command: SlashCommand) => {
  const paramArray = command.text.trim().split(/\s+/);
  const type = paramArray[0] ?? '';
  const page = Number(paramArray[1]) || 1;

  switch (type) {
    case ListCommands.COMPANIES:
      const awaitedCompanyTagsText = await companyTagsText(page);
      return awaitedCompanyTagsText;
    case ListCommands.TOPICS:
      return topicTagsText(page);
    default:
      return helpString();
  }
};
