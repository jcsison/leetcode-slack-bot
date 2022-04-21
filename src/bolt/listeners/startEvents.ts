import { Log } from '../../lib/utils/helpers';
import { events } from '../events';

export const startEvents = () => {
  events.forEach(events => events());
  Log.info('Listening to events');
};
