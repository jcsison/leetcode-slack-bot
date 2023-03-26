import { receiver } from '../index.js';
import { empty } from './resource/index.js';

export const launchApi = () => {
  receiver.router.get('/', empty);
};
