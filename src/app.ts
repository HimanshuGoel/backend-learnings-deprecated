import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import * as path from 'path';
import favicon from 'serve-favicon';

import { Books } from './routes/books.route';
import { Health } from './routes/health.route';

import addErrorHandler from './middlewares/error-handler';

class App {
  public app!: express.Application;
  public booksRoute: Books = new Books();
  public HealthRoute: Health = new Health();

  constructor() {
    this.app = express();
    this.config();
    this.booksRoute.routes(this.app);
    this.HealthRoute.routes(this.app);
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(favicon(path.join(__dirname, '../favicon.png')));
    this.app.use(cors());
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(addErrorHandler);
    this.app.use(
      bodyParser.urlencoded({
        extended: false
      })
    );
  }
}

export default new App().app;
