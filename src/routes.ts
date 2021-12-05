import express from 'express';

import { AuthRoute } from './routes/auth.route';
import { HealthRoute } from './routes/health.route';
import { BooksRoute } from './routes/books.route';

export default function registerRoutes(app: express.Application): void {
  new AuthRoute(app);
  new HealthRoute(app);
  new BooksRoute(app);
}
