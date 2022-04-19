import { Log } from '../../lib/utils/helpers';
import { commands } from '../commands';

export const startCommands = () => {
  commands.forEach(command => command());
  Log.info('Listening to commands');
};
