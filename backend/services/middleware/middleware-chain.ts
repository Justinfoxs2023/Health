import { Request, Response, NextFunction } from 'express';

export class MiddlewareChain {
  private middlewares: ((req: Request, res: Response, next: NextFunction) => void)[] = [];

  add(middleware: (req: Request, res: Response, next: NextFunction) => void): void {
    this.middlewares.push(middleware);
  }

  execute(req: Request, res: Response, next: NextFunction): void {
    const executeMiddleware = (index: number): void => {
      if (index === this.middlewares.length) {
        next();
        return;
      }

      const middleware = this.middlewares[index];
      middleware(req, res, () => executeMiddleware(index + 1));
    };

    executeMiddleware(0);
  }
}
