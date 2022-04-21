import { Request, Response } from 'express';

import { Log } from '../../lib/utils/helpers';

export const empty = (req: Request, res: Response) => {
  Log.info('Received ping');
  res.sendStatus(200);
};
