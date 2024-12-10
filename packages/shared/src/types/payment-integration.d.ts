// 支付系统集成
export interface PaymentSystem {
  // 支付方式配置
  paymentMethods: {
    bankCards: BankCardConfig[];
    alipay: AlipayConfig;
    wechat: WechatPayConfig;
    platformAccount: PlatformAccountConfig;
  };
  
  // 支付通道
  paymentChannels: {
    [key in PaymentChannelType]: PaymentChannelConfig;
  };
  
  // 收款账户配置
  receivingAccounts: {
    personal: PersonalReceivingAccount[];
    family: FamilyReceivingAccount[];
    platform: PlatformReceivingAccount;
  };
  
  // 资金流转规则
  fundFlowRules: {
    serviceIncome: ServiceIncomeRule[];
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
  PLATFORM_BALANCE = 'platformBalance'
}

// 银行卡配置
export interface BankCardConfig {
  id: string;
  cardType: 'debit' | 'credit';
  bankName: string;
  cardNumber: string;
  holderName: string;
  isDefault: boolean;
  dailyLimit: number;
  singleLimit: number;
  supportedServices: string[];
}

// 支付宝配置
export interface AlipayConfig {
  enabled: boolean;
  appId: string;
  merchantId: string;
  publicKey: string;
  privateKey: string;
  notifyUrl: string;
  returnUrl: string;
}

// 服务收入规则
export interface ServiceIncomeRule {
  serviceType: string;
  platformFeePercentage: number;
  familyFundPercentage: number;
  personalAccountPercentage: number;
  minimumAmount: number;
  settlementPeriod: number;
  autoDistribution: boolean;
} 