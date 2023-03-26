import { bolt } from '../../index.js';

export const getBotId = async (token: string) => {
  const info = await bolt.client.auth.test({ token });
  return info.user_id;
};
