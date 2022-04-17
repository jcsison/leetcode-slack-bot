import { bolt } from '../..';
import { Log } from '../../lib/utils/helpers';
import { SlackCommandMiddlewareArgs } from '@slack/bolt';

export const command =
  (
    name: string,
    action: () => string | undefined | Promise<string | undefined>
  ) =>
  () =>
    bolt.command(name, async ({ ack, say }: SlackCommandMiddlewareArgs) => {
      try {
        await ack();
        const text = await action();

        if (!text) {
          throw new Error(`Error running ${name}`);
        }

        await say(text);
        Log.info(`${name} command triggered`);
      } catch (error) {
        Log.error(error, `Error running ${name}`);
      }
    });
