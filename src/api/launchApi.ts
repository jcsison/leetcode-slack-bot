import { app } from '..';
import { empty, oauth } from './resource';

export const launchApi = () => {
  app.get('/', empty);
  app.get('/oauth/authorize', oauth);
};
