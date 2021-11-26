import { StatusCodes } from 'http-status-codes';

import express from 'express';
import util from 'util';

import ApiError from '../abstractions/api-error';
import Logger from '../utilities/logger.utility';

const addErrorHandler = (
  err: ApiError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
      stack: ''
    };

    body.stack = err.stack || '';

    res.status(status).json(body);
  }
  next();
};

export default addErrorHandler;
