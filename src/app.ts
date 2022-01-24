import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
// import path from 'path';
// import favicon from 'serve-favicon';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

import registerRoutes from './routes';
import { addApiErrorHandler, addLogsErrorHandler } from './middlewares/error-handler';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

class App {
  public app!: express.Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    // this.setFavicon();
  }

  private setMiddlewares(): void {
    this.app.use(xss());
    this.app.use(cors());
    this.app.use(limiter);
    this.app.use(helmet());
    this.app.use(morgan('tiny'));
    this.app.use(addLogsErrorHandler);
    this.app.use(addApiErrorHandler);
    this.app.use(bodyParser.json());
    this.app.use(express.json({ limit: '300kb' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  // private setFavicon(): void {
  //   this.app.use(favicon(path.join(__dirname, '../favicon.png')));
  // }

  private setRoutes(): void {
    this.app.get('/', this.basePathRoute);
    registerRoutes(this.app);
  }

  private basePathRoute(request: express.Request, response: express.Response): void {
    response.json({ message: 'base path' });
  }
}

export default new App().app;
