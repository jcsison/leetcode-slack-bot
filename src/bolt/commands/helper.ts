import { Guard, Log } from '../../lib/utils/helpers';
import { SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';
import { bolt } from '../..';

export enum CommandType {
  POST = 'post',
  UPDATE = 'update'
}

interface CommandProps {
  name: string;
  type?: CommandType;
  action: (
    payload: SlashCommand
  ) => unknown | undefined | Promise<unknown | undefined>;
}

export interface UpdateData {
  text: string;
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
          if (!Guard.string(data)) {
            throw new Error('Invalid data type, expected string');
          }

          await res.say({
            channel: res.command.channel_id,
            text: data
          });
          break;
        case CommandType.UPDATE:
          if (!Guard.object<UpdateData>('text', 'ts')(data)) {
            throw new Error('Invalid data type, expected UpdateData');
          }

          await bolt.client.chat.update({
            channel: res.command.channel_id,
            text: data.text,
            ts: data.ts
          });
          break;
      }

      Log.info(`${props.name} command triggered`);
    } catch (error) {
      Log.error(error, `Error running ${props.name}`);
    }
  });
