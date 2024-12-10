declare module 'winston-daily-rotate-file' {
  import { transport } from 'winston';
  import { Format } from 'logform';
  
  interface DailyRotateFileTransportOptions {
    filename: string;
    datePattern?: string;
    zippedArchive?: boolean;
    maxSize?: string;
    maxFiles?: string;
    dirname?: string;
    level?: string;
    format?: Format;
    handleExceptions?: boolean;
    json?: boolean;
    eol?: string;
    auditFile?: string;
    extension?: string;
    utc?: boolean;
    createSymlink?: boolean;
    symlinkName?: string;
  }

  class DailyRotateFile extends transport {
    constructor(options: DailyRotateFileTransportOptions);
  }

  export = DailyRotateFile;
} 