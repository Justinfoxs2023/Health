/**
 * @fileoverview TS 文件 report.template.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const ReportTemplate = {
  // PDF报告模板
  pdf: {
    // 封面模板
    cover: {
      title: '健康报告',
      subtitle: '{{timeRange}}',
      logo: 'path/to/logo.png',
      footer: '{{generatedAt}}',
    },

    // 摘要部分
    summary: {
      title: '健康概况',
      sections: [
        {
          type: 'healthScore',
          title: '健康评分',
          chart: 'radar',
          description: '{{summaryText}}',
        },
        {
          type: 'keyMetrics',
          title: '关键指标',
          layout: 'grid',
        },
        {
          type: 'trends',
          title: '健康趋势',
          chart: 'line',
        },
      ],
    },

    // 详细指标
    metrics: {
      title: '健康指标详情',
      sections: [
        {
          type: 'vitalSigns',
          title: '生命体征',
          metrics: ['heartRate', 'bloodPressure', 'bloodOxygen'],
          chart: 'line',
        },
        {
          type: 'activities',
          title: '活动数据',
          metrics: ['steps', 'distance', 'calories'],
          chart: 'bar',
        },
        {
          type: 'sleep',
          title: '睡眠分析',
          metrics: ['duration', 'quality', 'pattern'],
          chart: 'area',
        },
        {
          type: 'nutrition',
          title: '营养摄入',
          metrics: ['calories', 'protein', 'carbs', 'fat'],
          chart: 'pie',
        },
      ],
    },

    // 趋势分析
    trends: {
      title: '趋势分析',
      sections: [
        {
          type: 'comparison',
          title: '同期对比',
          chart: 'bar',
        },
        {
          type: 'prediction',
          title: '趋势预测',
          chart: 'line',
        },
      ],
    },

    // 建议部分
    recommendations: {
      title: '健康建议',
      sections: [
        {
          type: 'lifestyle',
          title: '生活方式建议',
        },
        {
          type: 'exercise',
          title: '运动建议',
        },
        {
          type: 'diet',
          title: '饮食建议',
        },
        {
          type: 'medical',
          title: '医疗建议',
        },
      ],
    },
  },

  // Excel报告模板
  excel: {
    sheets: [
      {
        name: '健康概况',
        sections: [
          {
            type: 'summary',
            range: 'A1:E10',
            format: 'table',
          },
          {
            type: 'charts',
            range: 'A11:E30',
            charts: ['healthScore', 'trends'],
          },
        ],
      },
      {
        name: '详细数据',
        sections: [
          {
            type: 'metrics',
            range: 'A1:Z1000',
            format: 'table',
            filters: true,
          },
        ],
      },
      {
        name: '趋势分析',
        sections: [
          {
            type: 'trends',
            range: 'A1:E20',
            charts: ['comparison', 'prediction'],
          },
        ],
      },
      {
        name: '建议',
        sections: [
          {
            type: 'recommendations',
            range: 'A1:C100',
            format: 'list',
          },
        ],
      },
    ],
    styles: {
      header: {
        font: { bold: true, size: 12 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } },
      },
      data: {
        font: { size: 11 },
        numberFormat: '#,##0.00',
      },
      chart: {
        width: 600,
        height: 400,
      },
    },
  },
};
