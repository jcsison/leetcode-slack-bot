import FormData from 'form-data';
import axios from 'axios';
import { Request, Response } from 'express';

import { DataError, Maybe, SlackTypes } from '../../lib/utils/types';
import { Log } from '../../lib/utils/helpers';

export const oauth = async (req: Request, res: Response) => {
  try {
    Log.info(req);

    if (!req.query.code) {
      throw new Error('Access denied');
    }

    if (!process.env.SLACK_API_URL) {
      throw new Error('Slack API URL not found');
    }

    if (!process.env.SLACK_CLIENT_ID) {
      throw new Error('Slack client ID not found');
    }

    if (!process.env.SLACK_CLIENT_SECRET) {
      throw new Error('Slack client secret not found');
    }

    const data = new FormData();
    data.append('client_id', process.env.SLACK_CLIENT_ID);
    data.append('client_secret', process.env.SLACK_CLIENT_SECRET);
    data.append('code', req.query.code.toString());

    const apiResponse = await axios.post<Maybe<SlackTypes.OAuthResponse>>(
      process.env.SLACK_API_URL + '/oauth.v2.access',
      data,
      { headers: data.getHeaders() }
    );

    if (apiResponse.status === 200 && apiResponse.data?.ok) {
      Log.info('User authenticated');
      res.sendStatus(200);
    } else {
      throw new DataError('Error authenticating user', apiResponse.data?.error);
    }
  } catch (error) {
    Log.info(error, 'Error authenticating user');
    res.sendStatus(500);
  }
};
