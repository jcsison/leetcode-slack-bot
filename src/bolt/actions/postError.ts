import { Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';

export const postError = async (
  text: string,
  channelId: string,
  token: string,
  userId: string,
  throwError?: boolean
) => {
  try {
    await bolt.client.chat.postEphemeral({
      channel: channelId,
      text: `Error: ${text}!`,
      token,
      user: userId
    });
  } catch (error) {
    Log.error(error, 'Error posting message');
  }

  if (throwError === undefined || throwError) {
    throw new Error(text);
  }
};
