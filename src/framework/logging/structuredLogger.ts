import { StructuredLogMessage, LogLevel } from "./types";

// Note this structured logger is not fully fleshed out, will want to revisit structured logging
// at some point to be able to better correlate log messages to a specific request
export class StructuredLogger {

  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  public log(message: string, properties: {[key:string]: any}) {
    console.log(JSON.stringify(this.format(message, LogLevel.INFO, properties), null, 2));
  }

  public debug(message: string, properties: {[key:string]: any},) {
    console.debug(JSON.stringify(this.format(message, LogLevel.DEBUG, properties), null, 2));
  }

  public warn(message: string, properties: {[key:string]: any}, error?: Error) {
    console.warn(JSON.stringify(this.format(message, LogLevel.WARN, properties, error), null, 2));
  }

  public error(message: string, properties: {[key:string]: any}, error?: Error) {
    console.error(JSON.stringify(this.format(message, LogLevel.ERROR, properties, error), null, 2));
  }

  private format(message: string, logLevel: LogLevel, properties: {[key:string]: any}, error?: Error): StructuredLogMessage {
    return {
      message: message,
      context: this.context,
      logLevel: logLevel,
      properties: properties,
      error: `${error}`
    };
  }
}
