import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import registerRoutes from './routes';
import { addApiErrorHandler, addLogsErrorHandler } from './middlewares/error-handler';

class App {
  public app!: express.Application;

  constructor() {
    this.app = express();
    this.setRoutes();
    this.setMiddlewares();
    this.setFavicon();
  }

  private setMiddlewares(): void {
    this.app.use(cors());
    this.app.use(addLogsErrorHandler);
    this.app.use(addApiErrorHandler);
    this.app.use(bodyParser.json());
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private setFavicon(): void {
    // this.app.use(favicon(path.join(__dirname, '../favicon.png')));
  }

  private setRoutes(): void {
    this.app.get('/', this.basePathRoute);
    registerRoutes(this.app);
  }

  private basePathRoute(request: express.Request, response: express.Response): void {
    response.json({ message: 'base path' });
  }
}

export default new App().app;
