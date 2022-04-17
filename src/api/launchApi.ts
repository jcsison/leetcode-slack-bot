import { receiver } from '..';
import { empty, oauth } from './resource';

export const launchApi = () => {
  receiver.router.get('/', empty);
  receiver.router.get('/oauth/authorize', oauth);
};
