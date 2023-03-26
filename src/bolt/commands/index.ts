import {
  delete_,
  help,
  list,
  reroll,
  roll,
  start,
  stop
} from './commandActions/index.js';
import { command, CommandType } from './helper.js';

export const commands = [
  command({ name: '/delete', type: CommandType.DELETE, action: delete_ }),
  command({ name: '/help', action: help }),
  command({ name: '/list', action: list }),
  command({ name: '/reroll', type: CommandType.UPDATE, action: reroll }),
  command({ name: '/roll', action: roll }),
  command({ name: '/start', action: start }),
  command({ name: '/stop', action: stop })
];
