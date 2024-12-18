/**
 * @fileoverview TSX 文件 health-charts.tsx 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export const HealthTrendChart: React.FC<TrendChartProps> = ({ data, metrics, timeRange }) => {
  const chartConfig = {
    type: 'line',
    data: {
      labels: data.map(d => d.timestamp),
      datasets: metrics.map(metric => ({
        label: metric.label,
        data: data.map(d => d[metric.key]),
        borderColor: metric.color,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeRange,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <Card className="trend-chart-card">
      <CardHeader title="健康趋势" />
      <CardContent>
        <Line {...chartConfig} />
      </CardContent>
    </Card>
  );
};
