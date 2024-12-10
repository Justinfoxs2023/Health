import { api } from '../utils/api';

export interface PaymentInfo {
  amount: number;
  currency: string;
  serviceType: 'consultation' | 'subscription' | 'report';
  serviceId: string;
  paymentMethod: 'alipay' | 'wechat' | 'creditCard';
}

export class PaymentService {
  async createPayment(paymentInfo: PaymentInfo) {
    try {
      const response = await api.post('/api/payment/create', paymentInfo);
      return response.data;
    } catch (error) {
      console.error('创建支付订单失败:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await api.get(`/api/payment/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('获取支付状态失败:', error);
      throw error;
    }
  }

  async getPaymentHistory(userId: string) {
    try {
      const response = await api.get(`/api/payment/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取支付历史失败:', error);
      throw error;
    }
  }
} 