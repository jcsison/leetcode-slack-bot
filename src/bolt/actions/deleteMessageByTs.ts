import { bolt } from '../../index.js';
import { Log } from '../../lib/utils/helpers/index.js';

export const deleteMessageByTs = async (
  channelId: string,
  token: string,
  ts: string
) => {
  try {
    await bolt.client.chat.delete({
      channel: channelId,
      token,
      ts
    });
  } catch (e) {
    Log.error('Error deleting message');
  }
};
