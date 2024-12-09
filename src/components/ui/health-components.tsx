// 健康数据卡片组件
export const HealthMetricCard: React.FC<HealthMetricProps> = ({
  title,
  value,
  unit,
  trend,
  status
}) => {
  return (
    <Card elevation={2} className="health-metric-card">
      <CardHeader
        title={title}
        action={
          <IconButton>
            <InfoIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="h4">{value}{unit}</Typography>
        <TrendIndicator value={trend} status={status} />
      </CardContent>
    </Card>
  );
};

// 进度环形图组件
export const CircularProgress: React.FC<ProgressProps> = ({
  value,
  total,
  label,
  size = 120
}) => {
  const percentage = (value / total) * 100;
  
  return (
    <Box className="circular-progress">
      <svg width={size} height={size}>
        {/* SVG 进度环实现 */}
      </svg>
      <Typography className="progress-label">{label}</Typography>
      <Typography className="progress-value">{percentage}%</Typography>
    </Box>
  );
}; 