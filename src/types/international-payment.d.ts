// 国际支付方式配置
export interface InternationalPaymentConfig {
  // 信用卡支付
  creditCard: {
    providers: {
      visa: PaymentProviderConfig;
      mastercard: PaymentProviderConfig;
      americanExpress: PaymentProviderConfig;
      discover: PaymentProviderConfig;
    };
    processingRules: ProcessingRule[];
    securityMeasures: SecurityMeasure[];
  };
  
  // 数字支付钱包
  digitalWallet: {
    providers: {
      paypal: PaymentProviderConfig;
      stripe: PaymentProviderConfig;
      amazonPay: PaymentProviderConfig;
      googlePay: PaymentProviderConfig;
      applePay: PaymentProviderConfig;
    };
    integrationSettings: IntegrationSetting[];
    securityProtocols: SecurityProtocol[];
  };
  
  // 加密货币支付
  cryptocurrency: {
    supportedCoins: CryptoCurrency[];
    exchangeRates: ExchangeRateConfig;
    walletIntegration: WalletIntegration[];
    riskManagement: RiskManagementRule[];
  };
  
  // 区域支付方式
  regionalPayments: {
    europe: {
      sepa: PaymentProviderConfig;
      ideal: PaymentProviderConfig;
      sofort: PaymentProviderConfig;
    };
    americas: {
      venmo: PaymentProviderConfig;
      cashApp: PaymentProviderConfig;
    };
    asia: {
      grabPay: PaymentProviderConfig;
      linePay: PaymentProviderConfig;
      paytm: PaymentProviderConfig;
    };
  };
}

// 支付提供商配置
export interface PaymentProviderConfig {
  enabled: boolean;
  apiCredentials: {
    apiKey: string;
    secretKey: string;
    merchantId: string;
    environment: 'sandbox' | 'production';
  };
  processingFees: {
    percentage: number;
    fixedFee: number;
    currency: string;
  };
  supportedCurrencies: string[];
  paymentMethods: string[];
  webhookConfig: WebhookConfig;
} 