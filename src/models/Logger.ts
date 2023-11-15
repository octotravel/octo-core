export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARNING = "warning",
  LOG = "log",
  INFO = "info",
  DEBUG = "debug",
}

export interface Logger {
  fatal(data: unknown, context?: unknown): Promise<unknown>;
  error(data: unknown, context?: unknown): Promise<unknown>;
  warn(data: unknown, context?: unknown): Promise<unknown>;
  log(data: unknown, context?: unknown): Promise<unknown>;
  info(data: unknown, context?: unknown): Promise<unknown>;
  debug(data: unknown, context?: unknown): Promise<unknown>;
  logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<unknown>;
}

export class NullLogger implements Logger {
  public async fatal(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.FATAL, data, context);
  }

  public async error(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.ERROR, data, context);
  }

  public async warn(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.WARNING, data, context);
  }

  public async log(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.LOG, data, context);
  }

  public async info(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.INFO, data, context);
  }

  public async debug(data: string, context?: unknown): Promise<unknown> {
    return this.logLevel(LogLevel.DEBUG, data, context);
  }

  public async logLevel(level: LogLevel, data: unknown, context?: unknown): Promise<unknown> {
    return null;
  }
}
