import * as Commands from '../commands';
import { Log } from '../../lib/utils/helpers';

export const commands = () => {
  Commands.helpCommand();
  Commands.rerollCommand();
  Commands.rollCommand();

  Log.info('Listening to commands');
};
