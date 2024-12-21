/**
 * @fileoverview TS 文件 auth.middleware.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
