import { Response } from 'express';
import { IAuthRequest } from '../types/models';
import { HealthRisk } from '../models/health-risk.model';
import { User } from '../models/user.model';

interface HealthRiskData {
  level: string;
  type: string;
  suggestion: string;
}

export class HealthAnalysisController {
  /**
   * 分析用户健康状况
   */
  public async analyzeHealthStatus(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);

      if (!user?.healthData) {
        return res.status(400).json({
          success: false,
          message: '缺少健康数据'
        });
      }

      // 计算BMI
      const height = user.profile.height! / 100; // 转换为米
      const bmi = user.profile.weight! / (height * height);
      
      // BMI风险评估
      let bmiRisk: HealthRiskData | null = null;
      if (bmi < 18.5) {
        bmiRisk = {
          level: '中',
          type: '体重过轻',
          suggestion: '建议适当增加营养摄入,合理搭配饮食'
        };
      } else if (bmi > 24) {
        bmiRisk = {
          level: '高',
          type: '超重',
          suggestion: '建议控制饮食,增加运动量'
        };
      }

      // 血压风险评估
      let bloodPressureRisk: HealthRiskData | null = null;
      const { systolic, diastolic } = user.healthData.bloodPressure!;
      if (systolic > 140 || diastolic > 90) {
        bloodPressureRisk = {
          level: '高',
          type: '高血压风险',
          suggestion: '建议定期监测血压,控制盐分摄入'
        };
      }

      // 血糖风险评估
      let bloodSugarRisk: HealthRiskData | null = null;
      if (user.healthData.bloodSugar!.value > 6.1) {
        bloodSugarRisk = {
          level: '中',
          type: '血糖偏高',
          suggestion: '建议控制糖分摄入,规律作息'
        };
      }

      // 保存风险评估结果
      const risks = [bmiRisk, bloodPressureRisk, bloodSugarRisk].filter(risk => risk);
      if (risks.length > 0) {
        await HealthRisk.create({
          userId,
          risks,
          createdAt: new Date()
        });
      }

      // 生成健康建议
      const recommendations = {
        diet: [
          {
            type: '饮食建议',
            items: this.generateDietRecommendations(user)
          }
        ],
        exercise: [
          {
            type: '运动建议',
            items: this.generateExerciseRecommendations(user)
          }
        ],
        lifestyle: [
          {
            type: '生活方式建议',
            items: this.generateLifestyleRecommendations(user)
          }
        ]
      };

      res.json({
        success: true,
        data: {
          healthIndex: {
            bmi: {
              value: bmi.toFixed(1),
              status: this.getBMIStatus(bmi)
            },
            bloodPressure: {
              value: `${systolic}/${diastolic}`,
              status: this.getBloodPressureStatus(systolic, diastolic)
            },
            bloodSugar: {
              value: user.healthData.bloodSugar!.value,
              status: this.getBloodSugarStatus(user.healthData.bloodSugar!.value)
            }
          },
          risks,
          recommendations
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  /**
   * 获取历史健康风险记录
   */
  public async getRiskHistory(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10 } = req.query;

      const risks = await HealthRisk.find({ userId })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await HealthRisk.countDocuments({ userId });

      res.json({
        success: true,
        data: {
          risks,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  private getBMIStatus(bmi: number): string {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
  }

  private getBloodPressureStatus(systolic: number, diastolic: number): string {
    if (systolic < 120 && diastolic < 80) return '正常';
    if (systolic < 140 && diastolic < 90) return '偏高';
    return '高血压';
  }

  private getBloodSugarStatus(value: number): string {
    if (value < 6.1) return '正常';
    if (value < 7.0) return '偏高';
    return '糖尿病风险';
  }

  private generateDietRecommendations(user: any): string[] {
    const recommendations: string[] = [];
    const bmi = user.profile.weight! / Math.pow(user.profile.height! / 100, 2);

    if (bmi > 24) {
      recommendations.push('控制总热量摄入,每天减少300-500千卡');
      recommendations.push('增加蔬菜水果摄入,减少精制碳水化合物');
    } else if (bmi < 18.5) {
      recommendations.push('适当增加优质蛋白质的摄入');
      recommendations.push('增加全谷物和健康脂肪的摄入');
    }

    if (user.healthData.bloodPressure?.systolic > 140) {
      recommendations.push('限制钠盐摄入,每日不超过6克');
      recommendations.push('增加钾的摄入,多吃香蕉、土豆等');
    }

    return recommendations;
  }

  private generateExerciseRecommendations(user: any): string[] {
    const recommendations: string[] = [];
    const activityLevel = user.profile.activityLevel;

    if (activityLevel === '久坐') {
      recommendations.push('建议每天进行30分钟中等强度有氧运动');
      recommendations.push('可以从快走开始,逐渐增加运动强度');
    } else if (activityLevel === '轻度活动') {
      recommendations.push('建议增加运动强度,每周进行3-4次有氧运动');
      recommendations.push('可以尝试跑步、游泳等运动');
    }

    return recommendations;
  }

  private generateLifestyleRecommendations(user: any): string[] {
    const recommendations: string[] = [];

    recommendations.push('保持规律作息,每天保证7-8小时睡眠');
    recommendations.push('避免久坐,每隔1小时起来活动5-10分钟');
    
    if (user.healthData.bloodPressure?.systolic > 140) {
      recommendations.push('保持心情愉悦,学会压力管理');
      recommendations.push('戒烟限酒');
    }

    return recommendations;
  }
}

export const healthAnalysisController = new HealthAnalysisController(); 