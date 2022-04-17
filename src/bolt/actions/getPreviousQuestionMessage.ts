import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { uri } from '../../lib/dataSource/leetcode/graphql/config';

export const getPreviousQuestionMessage = async (
  channelId: string,
  appId: string,
  userId: string
) => {
  try {
    const conversations = await bolt.client.conversations.history({
      channel: channelId
    });
    const messages = conversations.messages?.filter(
      message => message.bot_profile?.app_id === appId
    );
    const previousMessage = messages?.find(message =>
      message.text?.includes(uri.problem(''))
    );

    if (previousMessage?.reply_count) {
      await bolt.client.chat.postEphemeral({
        channel: channelId,
        text: 'Error: Previous question message already has replies',
        user: userId
      });
      throw new Error('Previous question message already has replies');
    }

    return previousMessage;
  } catch (error) {
    Log.error(error, 'Error fetching previous question message');
  }
};
