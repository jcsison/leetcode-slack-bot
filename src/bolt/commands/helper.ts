import { bolt } from '../..';
import { Guard, Log } from '../../lib/utils/helpers';
import { SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';

export enum CommandType {
  POST = 'post',
  UPDATE = 'update'
}

interface CommandProps {
  name: string;
  action: (
    payload: SlashCommand
  ) => unknown | undefined | Promise<unknown | undefined>;
}

export interface UpdateData {
  text: string;
  ts: string;
}

export const command =
  (props: CommandProps, commandType: CommandType = CommandType.POST) =>
  () =>
    bolt.command(props.name, async (args: SlackCommandMiddlewareArgs) => {
      try {
        await args.ack();
        const data = await props.action(args.payload);

        if (!data) {
          throw new Error('Invalid data');
        }

        switch (commandType) {
          case CommandType.POST:
          default:
            if (!Guard.string(data)) {
              throw new Error('Invalid data type, expected string');
            }

            await args.say(data);
            break;
          case CommandType.UPDATE:
            if (!Guard.object<UpdateData>('text', 'ts')(data)) {
              throw new Error('Invalid data type, expected UpdateData');
            }

            await bolt.client.chat.update({
              channel: args.command.channel_id,
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
