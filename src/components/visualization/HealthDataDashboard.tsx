import React from 'react';

import { IHealthData } from '../../types';
import { Line, Bar, Radar } from 'react-chartjs-2';

interface IProps {
  /** data 的描述 */
    data: IHealthData;
}

interface IChartData {
  /** labels 的描述 */
    labels: string;
  /** datasets 的描述 */
    datasets: {
    label: string;
    data: number;
    backgroundColor: string;
    borderColor: string;
  }[];
}

export const HealthDataDashboard: React.FC<IProps> = ({ data }): JSX.Element => {
  // 准备营养数据
  const nutritionChartData: IChartData = {
    labels: ['卡路里', '蛋白质', '碳水', '脂肪'],
    datasets: [{
      label: '营养摄入',
      data: [
        data.nutritionData.calorieIntake,
        data.nutritionData.proteinIntake,
        data.nutritionData.carbIntake,
        data.nutritionData.fatIntake
      ],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    }]
  };

  // 准备活动数据
  const activityChartData: IChartData = {
    labels: ['步数', '活动时间(分钟)', '消耗卡路里'],
    datasets: [{
      label: '活动数据',
      data: [
        data.activityData.steps,
        data.activityData.activeMinutes,
        data.activityData.caloriesBurned
      ],
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
    }]
  };

  // 准备生命体征数据
  const vitalSignsChartData: IChartData = {
    labels: ['心率', '收缩压', '舒张压', '体温', '呼吸率', '血氧'],
    datasets: [{
      label: '生命体征',
      data: [
        data.vitalSigns.heartRate,
        data.vitalSigns.bloodPressure.systolic,
        data.vitalSigns.bloodPressure.diastolic,
        data.vitalSigns.temperature,
        data.vitalSigns.respiratoryRate,
        data.vitalSigns.oxygenSaturation
      ],
      backgroundColor: 'rgba(153,102,255,0.4)',
      borderColor: 'rgba(153,102,255,1)',
    }]
  };

  return (
    <div className="health-dashboard">
      <div className="dashboard-section">
        <h2></h2>
        <Bar data={nutritionChartData} />
      </div>

      <div className="dashboard-section">
        <h2></h2>
        <Line data={activityChartData} />
      </div>

      <div className="dashboard-section">
        <h2></h2>
        <Radar data={vitalSignsChartData} />
      </div>

      <style jsx>{
        healthdashboard {
          padding 20px
          background f5f5f5
          borderradius 10px
        }

        dashboardsection {
          marginbottom 30px
          padding 20px
          background white
          borderradius 8px
          boxshadow 0 2px 4px rgba00001
        }

        h2 {
          color 333
          marginbottom 15px
        }
      }</style>
    </div>
  );
}; 