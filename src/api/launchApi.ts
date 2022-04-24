import { receiver } from '..';
import { empty } from './resource';

export const launchApi = () => {
  receiver.router.get('/', empty);
};
