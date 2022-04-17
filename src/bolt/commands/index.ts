import { help, reroll, roll } from './commandActions';
import { command, CommandType } from './helper';

export const helpCommand = command({ name: '/help', action: help });

export const rerollCommand = command(
  {
    name: '/reroll',
    action: reroll
  },
  CommandType.UPDATE
);

export const rollCommand = command({ name: '/roll', action: roll });
