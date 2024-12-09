declare module 'fs-extra' {
  import * as fs from 'fs';
  
  export interface PathEntry {
    name: string;
    isFile(): boolean;
    isDirectory(): boolean;
  }

  export interface ReadOptions {
    withFileTypes?: boolean;
    encoding?: string | null;
    flag?: string;
  }

  export * from 'fs';
  export function readdir(path: string): Promise<string[]>;
  export function readdir(path: string, options: { withFileTypes: true }): Promise<PathEntry[]>;
  export function readdir(path: string, options: ReadOptions): Promise<string[] | PathEntry[]>;
} 