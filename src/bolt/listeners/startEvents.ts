import { Log } from '../../lib/utils/helpers/index.js';
import { events } from '../events/index.js';

export const startEvents = () => {
  events.forEach(events => events());
  Log.info('Listening to events');
};
