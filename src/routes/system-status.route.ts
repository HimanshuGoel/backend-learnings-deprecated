import { Application, NextFunction, Request, Response } from 'express';
import * as os from 'os';
import * as process from 'process';
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import * as responseHandler from '../handlers/response.handler';
import ApiError from '../errors/api.error';
import BaseApi from './base.route';

/**
 * Status controller
 */
export default class SystemStatusController extends BaseApi {

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/status', this.router);
        this.router.get('/system', this.getSystemInfo);
        this.router.get('/time', this.getServerTime);
        this.router.get('/usage', this.getResourceUsage);
        this.router.get('/process', this.getProcessInfo);
        this.router.get('/error', this.getError);
    }

    public getSystemInfo(req: Request, res: Response, next: NextFunction): void {
        try {
            const response: ISystemInfoResponse = {
                cpus: os.cpus(),
                network: os.networkInterfaces() as any,
                os: {
                    platform: process.platform,
                    version: os.release(),
                    totalMemory: os.totalmem(),
                    uptime: os.uptime(),
                },
                currentUser: os.userInfo(),
            };
            res.locals.data = response;
            responseHandler.send(res);
        } catch (err) {
            next(err);
        }
    }

    public getError(req: Request, res: Response, next: NextFunction): void {
        try {
            throw new ApiError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
        } catch (error) {
            next(error);
        }
    }

    public getServerTime(req: Request, res: Response, next: NextFunction): void {
        try {
            const now: Date = new Date();
            const utc: Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            const time : IServerTimeResponse = {
                utc,
                date: now,
            };
            res.locals.data = time;
            responseHandler.send(res);
        } catch (error) {
            next(error);
        }
    }

    public getResourceUsage(req: Request, res: Response, next: NextFunction): void {
        try {
            const totalMem: number = os.totalmem();
            const memProc: NodeJS.MemoryUsage = process.memoryUsage();
            const freeMem: number = os.freemem();

            const response: IResourceUsageResponse = {
                processMemory: memProc,
                systemMemory: {
                    free: freeMem,
                    total: totalMem,
                    percentFree: Math.round((freeMem / totalMem) * 100),
                },
                processCpu: process.cpuUsage(),
                systemCpu: os.cpus(),
            };

            res.locals.data = response;
            responseHandler.send(res);
        } catch (err) {
            next(err);
        }
    }

    public getProcessInfo(req: Request, res: Response, next: NextFunction): void {
        try {
            const response: IProcessInfoResponse = {
                procCpu: process.cpuUsage(),
                memUsage: process.memoryUsage(),
                env: process.env,
                pid: process.pid,
                uptime: process.uptime(),
                applicationVersion: process.version,
                nodeDependencyVersions: process.versions,
            };
            res.locals.data = response;
            responseHandler.send(res);
        } catch (err) {
            next(err);
        }
    }
}

export interface INodeJsMemoryUsage {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
}

export interface INodeJsCpuUsage {
    user: number;
    system: number;
}

export interface INodeJsCpuInfo {
    model: string;
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
}

export interface ISystemMemory {
    total: number;
    free: number;
    percentFree: number;
}

export interface INodeJsNetworkInterfaceBase {
    address: string;
    netmask: string;
    mac: string;
    internal: boolean;
}

export interface INodeJsNetworkInterfaceInfoIPv4 extends INodeJsNetworkInterfaceBase {
    family: 'IPv4';
}

export interface INodeJsNetworkInterfaceInfoIPv6 extends INodeJsNetworkInterfaceBase {
    family: 'IPv6';
    scopeid: number;
}

export type INodeJsNetworkInterfaceInfo = INodeJsNetworkInterfaceInfoIPv4 | INodeJsNetworkInterfaceInfoIPv6;

export interface IServerTimeResponse {
    date: Date;
    utc: Date;
}

export interface INodeJsProcessVersions {
    http_parser: string;
    node: string;
    v8: string;
    ares: string;
    uv: string;
    zlib: string;
    modules: string;
    openssl: string;
}

export interface INodeJsProcessEnv {
    [key: string]: string | undefined;
}

export interface IProcessInfoResponse {
    procCpu: INodeJsCpuUsage;
    memUsage: INodeJsMemoryUsage;
    env: INodeJsProcessEnv;
    pid: number;
    uptime: number;
    applicationVersion: string;
    nodeDependencyVersions: INodeJsProcessVersions;

}

export interface IUserInfo {
    username: string;
    uid: number;
    gid: number;
    shell: string;
    homedir: string;
}

export interface IOsInformation {
    platform: string;
    version: string;
    totalMemory: number;
    uptime: number;
}

export interface ISystemInfoResponse {
    cpus: INodeJsCpuInfo[];
    network: { [index: string]: INodeJsNetworkInterfaceInfo[] };
    os: IOsInformation;
    currentUser: IUserInfo;
}


export interface IResourceUsageResponse {
    processMemory: INodeJsMemoryUsage;
    systemMemory: ISystemMemory;
    processCpu: INodeJsCpuUsage;
    systemCpu: INodeJsCpuInfo[];
}
