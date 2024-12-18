/**
 * @fileoverview TS 文件 international-payment.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 国际支付方式配置
export interface InternationalPaymentConfig {
   
  /** creditCard 的描述 */
    creditCard: {
    providers: {
      visa: IPaymentProviderConfig;
      mastercard: IPaymentProviderConfig;
      americanExpress: IPaymentProviderConfig;
      discover: IPaymentProviderConfig;
    };
    processingRules: ProcessingRule[];
    securityMeasures: SecurityMeasure[];
  };

  // 数字支付钱包
  /** digitalWallet 的描述 */
    digitalWallet: {
    providers: {
      paypal: IPaymentProviderConfig;
      stripe: IPaymentProviderConfig;
      amazonPay: IPaymentProviderConfig;
      googlePay: IPaymentProviderConfig;
      applePay: IPaymentProviderConfig;
    };
    integrationSettings: IntegrationSetting[];
    securityProtocols: SecurityProtocol[];
  };

  // 加密货币支付
  /** cryptocurrency 的描述 */
    cryptocurrency: {
    supportedCoins: CryptoCurrency[];
    exchangeRates: ExchangeRateConfig;
    walletIntegration: WalletIntegration[];
    riskManagement: RiskManagementRule[];
  };

  // 区域支付方式
  /** regionalPayments 的描述 */
    regionalPayments: {
    europe: {
      sepa: IPaymentProviderConfig;
      ideal: IPaymentProviderConfig;
      sofort: IPaymentProviderConfig;
    };
    americas: {
      venmo: IPaymentProviderConfig;
      cashApp: IPaymentProviderConfig;
    };
    asia: {
      grabPay: IPaymentProviderConfig;
      linePay: IPaymentProviderConfig;
      paytm: IPaymentProviderConfig;
    };
  };
}

// 支付提供商配置
export interface IPaymentProviderConfig {
  /** enabled 的描述 */
    enabled: false | true;
  /** apiCredentials 的描述 */
    apiCredentials: {
    apiKey: string;
    secretKey: string;
    merchantId: string;
    environment: sandbox  production;
  };
  /** processingFees 的描述 */
    processingFees: {
    percentage: number;
    fixedFee: number;
    currency: string;
  };
  /** supportedCurrencies 的描述 */
    supportedCurrencies: string[];
  /** paymentMethods 的描述 */
    paymentMethods: string[];
  /** webhookConfig 的描述 */
    webhookConfig: WebhookConfig;
}
