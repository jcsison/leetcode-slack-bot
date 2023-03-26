import pino from 'pino';
import { serializeError } from 'serialize-error';

import { DataError } from '../types/index.js';
import { Guard } from './index.js';

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
      JSON.stringify(serializeError(error)),
      message,
      error.message,
      error.data,
      ...params
    );
  } else if (Guard.object<Error>('name', 'message')(error)) {
    logger.error(error.message, message, ...params);
  } else if (Guard.string(error)) {
    logger.error(error, message, ...params);
  } else {
    logger.error(JSON.stringify(serializeError(error)), message, ...params);
  }
};

export const info = (info: unknown, message?: string, ...params: unknown[]) => {
  if (Guard.string(info)) {
    logger.info(info, message, ...params);
  } else {
    logger.info(JSON.stringify(info), message, ...params);
  }
};

export const warn = (warn: unknown, message?: string, ...params: unknown[]) => {
  if (Guard.string(warn)) {
    logger.warn(warn, message, ...params);
  } else {
    logger.warn(JSON.stringify(warn), message, ...params);
  }
};
