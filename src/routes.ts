import express from 'express';

import { HealthRoute } from './routes/health.route';
import { BooksRoute } from './routes/books.route';

export default function registerRoutes(app: express.Application): void {
  new HealthRoute(app);
  new BooksRoute(app);
}
