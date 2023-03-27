import { Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';

export const postMessage = async (
  text: string,
  channelId: string,
  token: string,
  threadTs?: string
) => {
  try {
    const response = await bolt.client.chat.postMessage({
      channel: channelId,
      text,
      thread_ts: threadTs,
      token
    });

    return response.ts;
  } catch (error) {
    Log.error(error, 'Error posting message');
  }
};
