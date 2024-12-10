import { api } from '../utils/api';
import { EncryptionService } from './encryption.service';
import { AuditLogService } from './audit-log.service';

export interface FoodAnalysisResult {
  foodType: string;
  portion: number; // 克
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  confidence: number;
}

export class FoodAnalysisService {
  private encryption = new EncryptionService();
  private auditLog = new AuditLogService();

  // 图像识别分析
  async analyzeImage(image: File): Promise<FoodAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await api.post('/api/food/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await this.auditLog.logAction('FOOD_IMAGE_ANALYSIS', 'FoodAnalysis', {
        imageSize: image.size,
        result: response.data
      });

      return response.data;
    } catch (error) {
      console.error('食物图像分析失败:', error);
      throw error;
    }
  }

  // 条形码扫描分析
  async analyzeBarcode(barcode: string): Promise<FoodAnalysisResult> {
    try {
      const response = await api.post('/api/food/analyze-barcode', { barcode });
      
      await this.auditLog.logAction('FOOD_BARCODE_ANALYSIS', 'FoodAnalysis', {
        barcode,
        result: response.data
      });

      return response.data;
    } catch (error) {
      console.error('条形码分析失败:', error);
      throw error;
    }
  }

  // 文本描述分析
  async analyzeDescription(description: string): Promise<FoodAnalysisResult> {
    try {
      const response = await api.post('/api/food/analyze-text', { description });
      
      await this.auditLog.logAction('FOOD_TEXT_ANALYSIS', 'FoodAnalysis', {
        description,
        result: response.data
      });

      return response.data;
    } catch (error) {
      console.error('食物描述分析失败:', error);
      throw error;
    }
  }

  // 计算与目标的差距
  async calculateCalorieBalance(
    userId: string,
    dailyIntake: number
  ): Promise<{
    target: number;
    current: number;
    remaining: number;
    recommendations: string[];
  }> {
    try {
      const response = await api.post('/api/food/calorie-balance', {
        userId,
        dailyIntake
      });
      return response.data;
    } catch (error) {
      console.error('卡路里平衡计算失败:', error);
      throw error;
    }
  }
} 