import topicTags from '../data/topicTags.json' assert { type: 'json' };
import { Guard } from '../../../utils/helpers/index.js';
import { LeetCodeTypes } from '../../../utils/types/index.js';

export const getTopicTags = () => {
  const topicTagsData = Guard.validate(
    topicTags,
    Guard.array(Guard.object<LeetCodeTypes.Tag>('id', 'name', 'slug'))
  );

  if (!topicTagsData) {
    throw new Error('Invalid tags data');
  }

  return topicTagsData;
};
