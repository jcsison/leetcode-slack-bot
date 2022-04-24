import _ from 'lodash';

import { LeetCodeTypes } from '../../../../lib/utils/types';
import { getCompanyTags } from '../../../../lib/dataSource/leetcode/actions/getCompanyTags';

export const companyTagsText = async (page: number) => {
  const tags = (await getCompanyTags())?.sort((a, b) =>
    a.slug > b.slug ? 1 : -1
  );

  if (!tags) {
    throw new Error('Error fetching company tags');
  }

  const tagsArray: LeetCodeTypes.Tag[][] = [];

  for (let i = 0; i < tags.length; i += 40) {
    tagsArray.push(tags.slice(i, i + 40));
  }

  const arrayPage = _.clamp(page, 1, tagsArray.length);

  const tagsString =
    '_Company Tags:_\n' +
    tagsArray[arrayPage - 1].map(tag => `\`${tag.slug}\``).join(' ') +
    `\n_page ${arrayPage} of ${tagsArray.length}_`;

  return tagsString;
};
