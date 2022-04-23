import pino from 'pino';

import { DataError } from '../types';
import { Guard } from '.';

const logger = pino({
  base: undefined
});

export const error = (
  error: unknown,
  message?: string,
  ...params: unknown[]
) => {
  if (Guard.object<DataError>('name', 'message', 'data')(error)) {
    logger.error(
      JSON.stringify(error),
      message,
      error.message,
      error.data,
      ...params
    );
  } else if (Guard.object<Error>('name', 'message')(error)) {
    logger.error(JSON.stringify(error), message, ...params);
  } else {
    logger.error(JSON.stringify(error), message, ...params);
  }
};

export const info = (info: unknown, message?: string, ...params: unknown[]) => {
  if (message) {
    logger.info(JSON.stringify(info), message, ...params);
  } else {
    logger.info(JSON.stringify(info), undefined, ...params);
  }
};
