import { Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';

export const postEphemeral = async (
  text: string,
  channelId: string,
  token: string,
  userId: string
) => {
  try {
    const response = await bolt.client.chat.postEphemeral({
      channel: channelId,
      text,
      token,
      user: userId
    });

    return response.message_ts;
  } catch (error) {
    Log.error(error, 'Error posting ephemeral message');
  }
};
