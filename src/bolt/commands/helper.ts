import { SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';

import { EnumType } from '../../lib/utils/types/index.js';
import { Guard, Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';
import { getTokenById } from '../actions/index.js';

export const COMMAND_TYPE = {
  POST: 'post',
  UPDATE: 'update',
  DELETE: 'delete'
} as const;

export type CommandAction<T = unknown> = (
  payload: SlashCommand,
  token: string
) => T | undefined | Promise<T | undefined>;

interface CommandProps {
  action: CommandAction;
  name: string;
  type?: EnumType<typeof COMMAND_TYPE>;
}

export interface TimeStampedMessageData {
  text?: string;
  ts: string;
}

export const command =
  ({ action, name, type }: CommandProps) =>
  () =>
    bolt.command(name, async (res: SlackCommandMiddlewareArgs) => {
      try {
        await res.ack();

        const token = await getTokenById({ teamId: res.body.team_id });

        const data = await action(res.payload, token);

        if (!data) {
          throw new Error('Invalid data');
        }

        switch (type) {
          case COMMAND_TYPE.POST:
          default:
            if (!(Guard.string(data) || Guard.array(Guard.string)(data))) {
              throw new Error('Invalid data type, expected string');
            }

            if (Guard.array()(data)) {
              for (const dataText of data) {
                await res.say({
                  channel: res.command.channel_id,
                  text: dataText
                });
              }
            } else {
              await res.say({
                channel: res.command.channel_id,
                text: data
              });
            }
            break;
          case COMMAND_TYPE.UPDATE:
            if (!Guard.object<TimeStampedMessageData>('text', 'ts')(data)) {
              throw new Error(
                'Invalid data type, expected TimeStampedMessageData'
              );
            }

            await bolt.client.chat.update({
              channel: res.command.channel_id,
              text: data.text,
              ts: data.ts,
              token
            });
            break;
          case COMMAND_TYPE.DELETE:
            if (!Guard.object<TimeStampedMessageData>('ts')(data)) {
              throw new Error(
                'Invalid data type, expected TimeStampedMessageData'
              );
            }

            await bolt.client.chat.delete({
              channel: res.command.channel_id,
              ts: data.ts,
              token
            });
            break;
        }

        Log.info(`${name} command triggered`);
      } catch (error) {
        Log.error(error, `Error running ${name}`);
      }
    });
