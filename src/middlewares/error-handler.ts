import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import util from 'util';

import { LogsRepo } from '../repos/logs.repo';
import ApiError from '../abstractions/api-error';
import Logger from '../utilities/logger.utility';

const addApiErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

    Logger.debug(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        \nREQUEST PARAMS:\n${util.inspect(req.params)}
        \nREQUEST QUERY:\n${util.inspect(req.query)}
        \nBODY:\n${util.inspect(req.body)}`);

    const body = {
      fields: err.fields,
      message: err.message || 'An error occurred during the request.',
      name: err.name,
      status,
      statusText: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      stack: ''
    };

    body.stack = err.stack || '';

    res.status(status).json(body);
  }
  next();
};

const addLogsErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorObject = {
    status: 500,
    statusText: 'Internal Server Error',
    message: err.message,
    error: {
      errno: (err as any).errno,
      call: (err as any).syscall,
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message
    }
  } as any;

  errorObject.requestInfo = {
    hostname: req.hostname,
    path: req.path,
    app: req.app
  };

  LogsRepo.write(
    errorObject,
    (data: any) => {
      // eslint-disable-next-line no-console
      console.log(data);
    },
    (error: Error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  );
  next(err);
};

export { addApiErrorHandler, addLogsErrorHandler };
