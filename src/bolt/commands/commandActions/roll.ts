import { SlashCommand } from '@slack/bolt';

import { LeetCodeTypes } from '../../../lib/utils/types';
import { Log } from '../../../lib/utils/helpers';
import { getCompanyTags } from '../../../lib/dataSource/leetcode/actions/getCompanyTags';
import {
  getRandomQuestion,
  getTopicTags
} from '../../../lib/dataSource/leetcode/actions';
import { getToken, postError } from '../../actions';

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
  try {
    const filters = command.text
      .trim()
      .split(/\s+/)
      .filter(filter => !!filter);
    const companyTags = await getCompanyTags();
    const topicTags = getTopicTags();

    for (const filter of filters) {
      if (!validateFilter(filter, [topicTags, companyTags])) {
        const token = await getToken(
          command.enterprise_id,
          !!command.is_enterprise_install,
          command.team_id
        );

        if (!token) {
          throw new Error('Error fetching token');
        }

        await postError(
          'Invalid filter',
          command.channel_id,
          token,
          command.user_id
        );
      }
    }

    const randomQuestion = await getRandomQuestion(filters);

    if (!randomQuestion) {
      throw new Error('Error fetching random question');
    }

    return randomQuestion.url;
  } catch (error) {
    Log.error(error, 'Error rolling question');
  }
};
