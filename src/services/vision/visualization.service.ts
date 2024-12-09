import { Chart } from 'chart.js';
import { Canvas } from 'canvas';
import { Logger } from '../../utils/logger';
import { visionConfig } from '../../config/vision.config';

export class VisualizationService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('Visualization');
  }

  // 生成姿势分析可视化
  async visualizePoseAnalysis(poseData: any) {
    try {
      const canvas = new Canvas(800, 600);
      const ctx = canvas.getContext('2d');
      
      // 绘制骨骼点和连接线
      this.drawSkeleton(ctx, poseData.keypoints);
      
      // 添加姿势评分和建议
      this.addAnalysisOverlay(ctx, poseData.analysis);
      
      return canvas.toBuffer();
    } catch (error) {
      this.logger.error('姿势分析可视化失败:', error);
      throw error;
    }
  }

  // 生成营养分析图表
  async createNutritionChart(nutritionData: any) {
    try {
      const canvas = new Canvas(600, 400);
      const ctx = canvas.getContext('2d');
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['蛋白质', '碳水化合物', '脂肪', '维生素', '矿物质'],
          datasets: [{
            data: [
              nutritionData.protein,
              nutritionData.carbs,
              nutritionData.fat,
              nutritionData.vitamins,
              nutritionData.minerals
            ],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: '营养成分分布'
            }
          }
        }
      });

      return canvas.toBuffer();
    } catch (error) {
      this.logger.error('营养分析图表生成失败:', error);
      throw error;
    }
  }

  // 生成运动强度热图
  async generateIntensityHeatmap(intensityData: any) {
    try {
      const canvas = new Canvas(1000, 800);
      const ctx = canvas.getContext('2d');
      
      // 绘制人体轮廓
      this.drawBodyOutline(ctx);
      
      // 绘制强度热图
      this.drawHeatmapOverlay(ctx, intensityData.muscleActivation);
      
      // 添加图例
      this.addIntensityLegend(ctx);
      
      return canvas.toBuffer();
    } catch (error) {
      this.logger.error('强度热图生成失败:', error);
      throw error;
    }
  }
} 