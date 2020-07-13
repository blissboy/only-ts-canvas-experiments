export interface StructuredLogMessage {
  message: string;
  context: string;
  logLevel: LogLevel;
  properties: {[key:string]: any};
  error?: any;
}

export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error'
}
