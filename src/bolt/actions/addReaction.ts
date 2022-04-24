import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { getBotId } from '.';

export const addReaction = async (
  reactionName: string,
  channelId: string,
  messageTs: string,
  token: string
) => {
  try {
    const reactionsData = await bolt.client.reactions.get({
      channel: channelId,
      timestamp: messageTs,
      token
    });

    const botId = await getBotId(token);

    if (!botId) {
      throw new Error('Error fetching bot ID');
    }

    const reaction = reactionsData.message?.reactions?.find(
      reaction =>
        reaction.users?.includes(botId) && reaction.name === reactionName
    );

    if (reaction) {
      throw new Error('Already reacted to message');
    }

    await bolt.client.reactions.add({
      channel: channelId,
      name: reactionName,
      timestamp: messageTs,
      token
    });
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
