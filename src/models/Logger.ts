export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface Logger {
  fatal: (data: any, context?: any) => Promise<any>;
  error: (data: any, context?: any) => Promise<any>;
  warn: (data: any, context?: any) => Promise<any>;
  log: (data: any, context?: any) => Promise<any>;
  info: (data: any, context?: any) => Promise<any>;
  debug: (data: any, context?: any) => Promise<any>;
  logLevel: (level: LogLevel, data: any, context?: any) => Promise<any>;
}

export class NullLogger implements Logger {
  public async fatal(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: any): Promise<any> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  public async logLevel(level: LogLevel, data: any, context?: any): Promise<any> {
    return null;
  }
}
