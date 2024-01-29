export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface Logger {
  fatal: (data: any, context?: unknown) => Promise<unknown>;
  error: (data: any, context?: unknown) => Promise<unknown>;
  warn: (data: any, context?: unknown) => Promise<unknown>;
  log: (data: any, context?: unknown) => Promise<unknown>;
  info: (data: any, context?: unknown) => Promise<unknown>;
  debug: (data: any, context?: unknown) => Promise<unknown>;
  logLevel: (level: LogLevel, data: unknown, context?: unknown) => Promise<unknown>;
}

export class NullLogger implements Logger {
  public async fatal(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: unknown): Promise<unknown> {
    return await this.logLevel(LogLevel.DEBUG, data, context);
  }

  public async logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<unknown> {
    return null;
  }
}
