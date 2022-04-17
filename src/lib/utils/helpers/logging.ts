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
    logger.error(error, message, error.message, error.data, ...params);
  } else if (Guard.object<Error>('name', 'message')(error)) {
    logger.error(error, message, ...params);
  } else {
    logger.error(error, message, ...params);
  }
};

export const info = (
  info: unknown,
  message?: string,
  ...params: unknown[]
) => {
  if (message) {
    logger.info(info, message, ...params);
  } else {
    logger.info(info, undefined, ...params);
  }
};
