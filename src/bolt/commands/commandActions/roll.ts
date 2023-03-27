import { SlashCommand } from '@slack/bolt';

import { CommandAction } from '../helper.js';
import { Enums, LeetCodeTypes } from '../../../lib/utils/types/index.js';
import { getCompanyTags } from '../../../lib/dataSource/leetcode/actions/getCompanyTags.js';
import {
  getRandomQuestion,
  getTopicTags
} from '../../../lib/dataSource/leetcode/actions/index.js';
import { postError } from '../../actions/index.js';

const validateFilter = (
  filter: string,
  tagsArray: Array<LeetCodeTypes.Tag[] | undefined>
) => {
  for (const tags of tagsArray) {
    if (tags?.some(tag => tag.slug === filter)) {
      return true;
    }
  }

  return false;
};

export const roll: CommandAction<string> = async (
  command: SlashCommand,
  token: string
) => {
  const tagFilters = command.text
    .trim()
    .split(/\s+/)
    .filter(filter => !!filter);
  const companyTags = await getCompanyTags();
  const topicTags = getTopicTags();

  for (const filter of tagFilters) {
    if (!validateFilter(filter, [topicTags, companyTags])) {
      await postError(
        'Invalid filter',
        command.channel_id,
        token,
        command.user_id
      );
    }
  }

  const randomQuestion = await getRandomQuestion(command.channel_id, {
    difficulty: Enums.QUESTION_DIFFICULTY.EASY,
    tags: tagFilters
  });

  return randomQuestion.url;
};
