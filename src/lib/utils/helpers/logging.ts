import pino from 'pino';

import { Guard } from '.';

export class DataError extends Error {
  data: unknown = undefined;

  constructor(message: string, data: unknown) {
    super(message);
    this.data = data;
  }
}

const logger = pino({
  base: undefined
});

export const logError = (
  error: unknown,
  message?: string,
  ...params: unknown[]
) => {
  if (Guard.object<DataError>('name', 'message', 'data')(error)) {
    logger.error(error, message, error.data, ...params);
  } else if (Guard.object<Error>('name', 'message')) {
    logger.error(error, message, ...params);
  } else {
    logger.error(undefined, message, ...params);
  }
};

export const logInfo = (
  info: unknown,
  message?: string,
  ...params: unknown[]
) => {
  if (typeof info === 'string') {
    logger.info(undefined, info, ...params);
  } else {
    logger.info(info, message, ...params);
  }
};
