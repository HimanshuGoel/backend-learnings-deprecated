import { Request, Response, Router } from 'express';

import {version} from '../../package.json';

export class Health {
  public routes(app: Router): void {
    app.route('/health').get((req: Request, res: Response) => {
      res.status(200).send({
        status: 'ok',
        version: version
      });
    });
  }
}
