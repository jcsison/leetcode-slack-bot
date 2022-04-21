import _ from 'lodash';

import { LeetCodeTypes } from '../../../../lib/utils/types';
import { Log } from '../../../../lib/utils/helpers';
import { getTopicTags } from '../../../../lib/dataSource/leetcode/actions';

export const topicTagsText = (page: number) => {
  try {
    const tags = getTopicTags()?.sort((a, b) => (a.slug > b.slug ? 1 : -1));

    if (!tags) {
      throw new Error('Error fetching topic tags');
    }

    const tagsArray: LeetCodeTypes.Tag[][] = [];

    for (let i = 0; i < tags.length; i += 40) {
      tagsArray.push(tags.slice(i, i + 40));
    }

    const arrayPage = _.clamp(page, 1, tagsArray.length);

    const tagsString =
      '_Topics Tags:_\n' +
      tagsArray[arrayPage - 1].map(tag => `\`${tag.slug}\``).join(' ') +
      `\n_page ${arrayPage} of ${tagsArray.length}_`;

    return tagsString;
  } catch (error) {
    Log.error(error, 'Error creating topic tags string');
  }
};
