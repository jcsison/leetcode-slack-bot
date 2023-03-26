import { SlashCommand } from '@slack/bolt';

import { Enums, LeetCodeTypes } from '../../../lib/utils/types/index.js';
import { getCompanyTags } from '../../../lib/dataSource/leetcode/actions/getCompanyTags.js';
import {
  getRandomQuestion,
  getTopicTags
} from '../../../lib/dataSource/leetcode/actions/index.js';
import { getToken, postError } from '../../actions/index.js';

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

export const roll = async (command: SlashCommand) => {
  const tagFilters = command.text
    .trim()
    .split(/\s+/)
    .filter(filter => !!filter);
  const companyTags = await getCompanyTags();
  const topicTags = getTopicTags();

  for (const filter of tagFilters) {
    if (!validateFilter(filter, [topicTags, companyTags])) {
      const token = await getToken(
        command.enterprise_id,
        !!command.is_enterprise_install,
        command.team_id
      );

      await postError(
        'Invalid filter',
        command.channel_id,
        token,
        command.user_id
      );
    }
  }

  const randomQuestion = await getRandomQuestion(command.channel_id, {
    difficulty: Enums.QuestionDifficulty.EASY,
    tags: tagFilters
  });

  return randomQuestion.url;
};
