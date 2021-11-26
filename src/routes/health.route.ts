import { NextFunction, Request, Response, Router } from 'express';
import * as os from 'os';
import * as process from 'process';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { version } from '../../package.json';
import ApiError from '../abstractions/api-error';

export class Health {
  public routes(app: Router): void {
    app
      .route('/health')
      .get((req: Request, res: Response, next: NextFunction) =>
        this.getServerHealth(req, res, next)
      );

    app
      .route('/system')
      .get((req: Request, res: Response, next: NextFunction) => this.getSystemInfo(req, res, next));

    app
      .route('/time')
      .get((req: Request, res: Response, next: NextFunction) => this.getServerTime(req, res, next));

    app
      .route('/usage')
      .get((req: Request, res: Response, next: NextFunction) =>
        this.getResourceUsage(req, res, next)
      );

    app
      .route('/process')
      .get((req: Request, res: Response, next: NextFunction) =>
        this.getProcessInfo(req, res, next)
      );

    app
      .route('/error')
      .get((req: Request, res: Response, next: NextFunction) => this.getError(req, res, next));
  }

  private getServerHealth(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        status: ReasonPhrases.OK,
        version: version
      });
    } catch (error) {
      next(error);
    }
  }

  private getSystemInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const response = {
        cpus: os.cpus(),
        network: os.networkInterfaces() as any,
        os: {
          platform: process.platform,
          version: os.release(),
          totalMemory: os.totalmem(),
          uptime: os.uptime()
        },
        currentUser: os.userInfo()
      };

      res.status(200).send({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private getServerTime(req: Request, res: Response, next: NextFunction) {
    try {
      const now: Date = new Date();
      const utc: Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const time = {
        utc,
        date: now
      };
      res.status(200).send({
        data: time
      });
    } catch (error) {
      next(error);
    }
  }

  private getResourceUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const totalMem: number = os.totalmem();
      const memProc: NodeJS.MemoryUsage = process.memoryUsage();
      const freeMem: number = os.freemem();

      const response = {
        processMemory: memProc,
        systemMemory: {
          free: freeMem,
          total: totalMem,
          percentFree: Math.round((freeMem / totalMem) * 100)
        },
        processCpu: process.cpuUsage(),
        systemCpu: os.cpus()
      };

      res.status(200).send({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private getProcessInfo(req: Request, res: Response, next: NextFunction): void {
    try {
      const response = {
        procCpu: process.cpuUsage(),
        memUsage: process.memoryUsage(),
        env: process.env,
        pid: process.pid,
        uptime: process.uptime(),
        applicationVersion: process.version,
        nodeDependencyVersions: process.versions
      };
      res.status(200).send({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  private getError(req: Request, res: Response, next: NextFunction): void {
    try {
      throw new ApiError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
    } catch (error) {
      next(error);
    }
  }
}
