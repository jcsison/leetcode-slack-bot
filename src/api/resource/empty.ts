import { Request, Response } from 'express';

import { logInfo } from '../../lib/utils/helpers';

export const empty = (_req: Request, res: Response) => {
  logInfo('Pinged');
  res.sendStatus(200);
};
