import { delete_, help, reroll, roll, start, stop } from './commandActions';
import { command, CommandType } from './helper';

export const commands = [
  command({ name: '/delete', type: CommandType.DELETE, action: delete_ }),
  command({ name: '/help', action: help }),
  command({ name: '/reroll', type: CommandType.UPDATE, action: reroll }),
  command({ name: '/roll', action: roll }),
  command({ name: '/start', action: start }),
  command({ name: '/stop', action: stop })
];
