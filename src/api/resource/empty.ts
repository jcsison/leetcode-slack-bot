import { Request, Response } from 'express';

import { logInfo } from '../../lib/utils/helpers';

export const empty = (_req: Request, res: Response) => {
  logInfo('Received ping');
  res.sendStatus(200);
};
