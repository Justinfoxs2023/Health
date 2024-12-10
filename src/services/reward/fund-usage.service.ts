import { Injectable } from '@nestjs/common';
import {
  RewardAccountSystem,
  Transaction,
  FundUsageRule,
  FundCategory
} from '../../types/reward-account';

@Injectable()
export class FundUsageService {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthorizationService,
    private readonly notificationService: NotificationService
  ) {}

  // 处理资金使用请求
  async processFundUsage(
    accountId: string,
    request: FundUsageRequest
  ): Promise<Transaction> {
    // 验证使用规则
    await this.validateUsageRules(accountId, request);
    
    // 检查余额
    await this.checkBalance(accountId, request.amount);
    
    // 创建交易
    const transaction = await this.createTransaction(accountId, request);
    
    // 如果需要审批
    if (await this.requiresApproval(request)) {
      await this.initiateApprovalProcess(transaction);
      return transaction;
    }
    
    // 执行交易
    return await this.executeTransaction(transaction);
  }

  // 处理提现请求
  async processWithdrawal(
    accountId: string,
    request: WithdrawalRequest
  ): Promise<Transaction> {
    // 验证提现限制
    await this.validateWithdrawalLimits(accountId, request);
    
    // 检查提现条件
    await this.checkWithdrawalConditions(accountId, request);
    
    // 创建提现交易
    const transaction = await this.createWithdrawalTransaction(
      accountId,
      request
    );
    
    // 执行提现
    return await this.executeWithdrawal(transaction);
  }

  // 处理账户间转账
  async processTransfer(
    fromAccountId: string,
    toAccountId: string,
    request: TransferRequest
  ): Promise<Transaction> {
    // 验证转账权限
    await this.validateTransferPermissions(fromAccountId, toAccountId);
    
    // 检查转账限制
    await this.checkTransferLimits(fromAccountId, request);
    
    // 创建转账交易
    const transaction = await this.createTransferTransaction(
      fromAccountId,
      toAccountId,
      request
    );
    
    // 执行转账
    return await this.executeTransfer(transaction);
  }

  // 生成使用报告
  async generateUsageReport(
    accountId: string,
    period: DateRange
  ): Promise<FundUsageReport> {
    const transactions = await this.getTransactions(accountId, period);
    
    return {
      summary: await this.calculateUsageSummary(transactions),
      categoryBreakdown: await this.analyzeCategoryUsage(transactions),
      trends: await this.analyzeUsageTrends(transactions),
      recommendations: await this.generateRecommendations(transactions)
    };
  }
} 