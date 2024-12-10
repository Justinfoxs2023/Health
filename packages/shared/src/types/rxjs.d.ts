declare module 'rxjs' {
  export interface Observable<T> {
    subscribe(observer: {
      next: (value: T) => void;
      error: (error: any) => void;
      complete: () => void;
    }): any;
  }

  export class Subject<T> extends Observable<T> {
    next(value: T): void;
    error(error: any): void;
    complete(): void;
  }

  export function of<T>(...args: T[]): Observable<T>;
  export function from<T>(input: T[] | Promise<T> | Observable<T>): Observable<T>;
} 