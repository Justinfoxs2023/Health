import { api } from '../utils/api';

export interface IPaymentInfo {
  /** amount 的描述 */
  amount: number;
  /** currency 的描述 */
  currency: string;
  /** serviceType 的描述 */
  serviceType: 'consultation' | 'subscription' | 'report';
  /** serviceId 的描述 */
  serviceId: string;
  /** paymentMethod 的描述 */
  paymentMethod: 'alipay' | 'wechat' | 'creditCard';
}

export class PaymentService {
  async createPayment(paymentInfo: IPaymentInfo) {
    try {
      const response = await api.post('/api/payment/create', paymentInfo);
      return response.data;
    } catch (error) {
      console.error('Error in payment.service.ts:', '创建支付订单失败:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await api.get(`/api/payment/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error in payment.service.ts:', '获取支付状态失败:', error);
      throw error;
    }
  }

  async getPaymentHistory(userId: string) {
    try {
      const response = await api.get(`/api/payment/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error in payment.service.ts:', '获取支付历史失败:', error);
      throw error;
    }
  }
}
