import topicTags from '../data/topicTags.json' assert { type: 'json' };
import { Guard, Log } from '../../../utils/helpers';
import { LeetCodeTypes } from '../../../utils/types';

export const getTopicTags = () => {
  try {
    const topicTagsData = Guard.validate(
      topicTags,
      Guard.array(Guard.object<LeetCodeTypes.Tag>('id', 'name', 'slug'))
    );

    if (!topicTagsData) {
      throw new Error('Invalid tags data');
    }

    return topicTagsData;
  } catch (error) {
    Log.error(error, 'Error fetching topic tags');
  }
};
