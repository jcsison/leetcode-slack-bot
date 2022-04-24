import { SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';

import { Guard, Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { getToken } from '../actions';

export enum CommandType {
  POST = 'post',
  UPDATE = 'update',
  DELETE = 'delete'
}

interface CommandProps {
  name: string;
  type?: CommandType;
  action: (
    payload: SlashCommand
  ) => unknown | undefined | Promise<unknown | undefined>;
}

export interface TimeStampedMessageData {
  text?: string;
  ts: string;
}

export const command = (props: CommandProps) => () =>
  bolt.command(props.name, async (res: SlackCommandMiddlewareArgs) => {
    try {
      await res.ack();
      const data = await props.action(res.payload);

      if (!data) {
        throw new Error('Invalid data');
      }

      switch (props.type) {
        case CommandType.POST:
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
        case CommandType.UPDATE:
          if (!Guard.object<TimeStampedMessageData>('text', 'ts')(data)) {
            throw new Error(
              'Invalid data type, expected TimeStampedMessageData'
            );
          }

          const updateToken = await getToken(
            res.payload.enterprise_id,
            !!res.payload.is_enterprise_install,
            res.payload.team_id
          );

          await bolt.client.chat.update({
            channel: res.command.channel_id,
            text: data.text,
            ts: data.ts,
            token: updateToken
          });
          break;
        case CommandType.DELETE:
          if (!Guard.object<TimeStampedMessageData>('ts')(data)) {
            throw new Error(
              'Invalid data type, expected TimeStampedMessageData'
            );
          }

          const deleteToken = await getToken(
            res.payload.enterprise_id,
            !!res.payload.is_enterprise_install,
            res.payload.team_id
          );

          await bolt.client.chat.delete({
            channel: res.command.channel_id,
            ts: data.ts,
            token: deleteToken
          });
          break;
      }

      Log.info(`${props.name} command triggered`);
    } catch (error) {
      Log.error(error, `Error running ${props.name}`);
    }
  });
