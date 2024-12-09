export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 实现认证中间件
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError();
    }
    // 验证token
    next();
  } catch (error) {
    next(error);
  }
} 