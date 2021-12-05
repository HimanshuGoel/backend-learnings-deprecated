import { Request, Response, Application, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import BaseApiRoute from './base-api.route';

import { UsersRepo } from '../repos/users.repo';
import { getJwtOptions } from '../utilities/global-functions.utility';

export class AuthRoute extends BaseApiRoute {
  constructor(express: Application) {
    super();
    this.register(express);
  }

  public register(app: Application): void {
    app.use('/api', this.router);
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.set('content-type', 'application/json');
      res.set('access-control-allow-origin', process.env.CORS_ALLOW_ORIGIN);
      res.set('access-control-allow-methods', 'GET, POST, PUT, DELETE');
      res.set('access-control-allow-headers', 'authorization, content-type');
      next();
    });

    this.router.get('/login', this.doLogin);
  }

  private doLogin(req: Request, res: Response, next: NextFunction) {
    let base64Encoding = (req.headers.authorization as string).split(' ')[1];
    let credentials = Buffer.from(base64Encoding, 'base64').toString().split(':');

    const username = credentials[0];
    const password = credentials[1];

    UsersRepo.getAll(
      (response: any) => {
        const user = response.find((user: any) => user.username === username);
        if (user) {
          bcrypt.compare(password, user.key, (err: any, result: any) => {
            if (result) {
              const token = this.generateJwtToken(username);
              res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                statusText: ReasonPhrases.OK,
                message: 'Login successful',
                data: { username: user.username, role: user.role },
                token
              });
            } else {
              res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                statusText: ReasonPhrases.UNAUTHORIZED,
                message: 'Invalid username or password',
                data: []
              });
            }
          });
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            statusText: ReasonPhrases.UNAUTHORIZED,
            message: 'Invalid username or password',
            data: []
          });
        }
      },
      function (err: Error) {
        next(err);
      }
    );
  }

  private generateJwtToken(user: any, prevToken: string = '') {
    const options = {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.EXPIRY,
      issuer: process.env.ISSUER,
      subject: user.name,
      audience:
        user.role === 'admin'
          ? getJwtOptions().JWT_OPTIONS.ADMIN_AUDIENCE
          : getJwtOptions().JWT_OPTIONS.MEMBER_AUDIENCE
    };
    return jwt.sign({}, process.env.SECRET as jwt.Secret, options as jwt.SignOptions);
  }

  private getUsernameFromToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded!.sub;
  }
}
