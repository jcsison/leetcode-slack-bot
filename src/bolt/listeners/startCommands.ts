import { Log } from '../../lib/utils/helpers/index.js';
import { commands } from '../commands/index.js';

export const startCommands = () => {
  commands.forEach(command => command());
  Log.info('Listening to commands');
};
