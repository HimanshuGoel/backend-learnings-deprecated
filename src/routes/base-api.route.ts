import { Application, Router } from 'express';

/**
 * Provides services common to all API methods
 */
export abstract class BaseApiRoute {
  protected router: Router;

  protected constructor() {
    this.router = Router();
  }

  public abstract register(express: Application): void;
}
