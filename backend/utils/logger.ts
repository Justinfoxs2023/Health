export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  error(message: string, error?: any) {
    console.error(`[${this.context}] ${message}`, error);
  }

  info(message: string) {
    console.info(`[${this.context}] ${message}`);
  }

  warn(message: string) {
    console.warn(`[${this.context}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[${this.context}] ${message}`);
  }
}

export const logger = new Logger('App'); 