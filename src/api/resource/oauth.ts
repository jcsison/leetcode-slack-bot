import { Request, Response } from 'express';

import { logError, logInfo } from '../../lib/utils/helpers';

export const oauth = async (req: Request, res: Response) => {
  try {
    logInfo(req);

    if (!req.query.code) {
      throw new Error('Access denied');
    }

    if (!process.env.SLACK_API_URL) {
      throw new Error('Slack API URL not found');
    }

    const data = {
      form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code
      }
    };

    const apiResponse = await fetch(process.env.SLACK_API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (apiResponse.status === 200) {
      logInfo('User authenticated');
      res.sendStatus(200);
    } else {
      throw new Error('Error authenticating user');
    }
  } catch (error) {
    logError(error, 'Error authenticating user');
    res.sendStatus(500);
  }
};
