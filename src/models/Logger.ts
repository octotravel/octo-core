export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARNING = "warning",
  LOG = "log",
  INFO = "info",
  DEBUG = "debug"
}

export interface Logger {
  fatal(message: unknown, context?: unknown): Promise<void>;
  error(message: unknown, context?: unknown): Promise<void>;
  warning(message: unknown, context?: unknown): Promise<void>;
  log(message: unknown, context?: unknown): Promise<void>;
  info(message: unknown, context?: unknown): Promise<void>;
  debug(message: unknown, context?: unknown): Promise<void>;
  logLevel(level: LogLevel, message: unknown, context?: unknown): Promise<void>;
}

export class NullLogger implements Logger {
  public async fatal(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.FATAL, message, context);
  }

  public async error(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.ERROR, message, context);
  }

  public async warning(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.WARNING, message, context);
  }

  public async log(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.LOG, message, context);
  }

  public async info(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.INFO, message, context);
  }

  public async debug(message: string, context?: unknown): Promise<void> {
    return this.logLevel(LogLevel.DEBUG, message, context);
  }

  public async logLevel(level: LogLevel, message: string, context?: unknown): Promise<void> {}
}
