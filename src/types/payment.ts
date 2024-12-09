export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CREDITCARD = 'creditcard',
  BANK = 'bank'
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  description: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  items: InvoiceItem[];
  amounts: {
    subtotal: number;
    tax: number;
    total: number;
  };
  status: InvoiceStatus;
  dueDate: Date;
  createdAt: Date;
} 