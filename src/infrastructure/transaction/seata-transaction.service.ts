import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';

interface ITransactionContext {
  /** xid 的描述 */
    xid: string;
  /** branchId 的描述 */
    branchId: string;
  /** status 的描述 */
    status: try  confirm  cancel;
}

@Injectable()
export class SeataTransactionService {
  constructor(private readonly config: ConfigService) {}

  async begin(): Promise<string> {
    // 开启全局事务
    return 'xid';
  }

  async commit(xid: string): Promise<void> {
    // 提交事务
  }

  async rollback(xid: string): Promise<void> {
    // 回滚事务
  }

  async registerBranch(xid: string, resourceId: string): Promise<string> {
    // 注册分支事务
    return 'branchId';
  }
}
