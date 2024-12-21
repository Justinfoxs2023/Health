/**
 * @fileoverview TS 文件 payment-integration.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 支付系统集成
export interface IPaymentSystem {
  // 支付方式配置
  /** paymentMethods 的描述 */
  paymentMethods: {
    bankCards: IBankCardConfig[];
    alipay: IAlipayConfig;
    wechat: WechatPayConfig;
    platformAccount: PlatformAccountConfig;
  };

  // 支付通道
  /** paymentChannels 的描述 */
  paymentChannels: {
    [key in PaymentChannelType]: PaymentChannelConfig;
  };

  // 收款账户配置
  /** receivingAccounts 的描述 */
  receivingAccounts: {
    personal: PersonalReceivingAccount[];
    family: FamilyReceivingAccount[];
    platform: PlatformReceivingAccount;
  };

  // 资金流转规则
  /** fundFlowRules 的描述 */
  fundFlowRules: {
    serviceIncome: IServiceIncomeRule[];
    productIncome: ProductIncomeRule[];
    platformFees: PlatformFeeRule[];
    withdrawalRules: WithdrawalRule[];
  };
}

// 支付通道类型
export enum PaymentChannelType {
  BANK_CARD = 'bankCard',
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  PLATFORM_BALANCE = 'platformBalance',
}

// 银行卡配置
export interface IBankCardConfig {
  /** id 的描述 */
  id: string;
  /** cardType 的描述 */
  cardType: 'debit' | 'credit';
  /** bankName 的描述 */
  bankName: string;
  /** cardNumber 的描述 */
  cardNumber: string;
  /** holderName 的描述 */
  holderName: string;
  /** isDefault 的描述 */
  isDefault: boolean;
  /** dailyLimit 的描述 */
  dailyLimit: number;
  /** singleLimit 的描述 */
  singleLimit: number;
  /** supportedServices 的描述 */
  supportedServices: string[];
}

// 支付宝配置
export interface IAlipayConfig {
  /** enabled 的描述 */
  enabled: boolean;
  /** appId 的描述 */
  appId: string;
  /** merchantId 的描述 */
  merchantId: string;
  /** publicKey 的描述 */
  publicKey: string;
  /** privateKey 的描述 */
  privateKey: string;
  /** notifyUrl 的描述 */
  notifyUrl: string;
  /** returnUrl 的描述 */
  returnUrl: string;
}

// 服务收入规则
export interface IServiceIncomeRule {
  /** serviceType 的描述 */
  serviceType: string;
  /** platformFeePercentage 的描述 */
  platformFeePercentage: number;
  /** familyFundPercentage 的描述 */
  familyFundPercentage: number;
  /** personalAccountPercentage 的描述 */
  personalAccountPercentage: number;
  /** minimumAmount 的描述 */
  minimumAmount: number;
  /** settlementPeriod 的描述 */
  settlementPeriod: number;
  /** autoDistribution 的描述 */
  autoDistribution: boolean;
}
