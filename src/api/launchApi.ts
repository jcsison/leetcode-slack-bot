import { app } from '..';
import { oauth } from './oauth';

export const launchApi = () => {
  app.get('/', () => {});
  app.get('/oauth/authorize', oauth);
};
