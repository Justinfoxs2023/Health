import React, { useEffect, useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { HealthMetricCard } from '../ui/health-components';
import { Line } from 'react-chartjs-2';

// 修改 Mate
rial-UI 组件的导入方式
// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IHealthData {
  /** timestamp 的描述 */
    timestamp: string;
  /** value 的描述 */
    value: number;
  /** type 的描述 */
    type: string;
}

const DataVisualization: React.FC = () => {
    const [healthData, setHealthData] = useState<IHealthData[]>([]);
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 使用 localStorage 进行数据缓存
    const getCachedData = (key: string) => {
        const cached = localStorage.getItem(`health_data_${key}`);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            // 缓存有效期为5分钟
            if (Date.now() - timestamp < 5 * 60 * 1000) {
                return data;
            }
        }
        return null;
    };

    const setCachedData = (key: string, data: IHealthData[]) => {
        localStorage.setItem(`health_data_${key}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    };

    // 获取健康数据
    const fetchHealthData = async () => {
        setLoading(true);
        setError(null);

        // 检查缓存
        const cachedData = getCachedData(timeRange);
        if (cachedData) {
            setHealthData(cachedData);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/health-data?range=${timeRange}`);
            setHealthData(response.data);
            setCachedData(timeRange, response.data);
        } catch (error) {
            setError('获取数据失败，请稍后重试');
            console.error('Error in DataVisualization.tsx:', '获取健康数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthData();
    }, [timeRange]);

    // 使用 useMemo 优化数据处理
    const chartData = useMemo(() => ({
        labels: healthData.map(d => d.timestamp),
        datasets: [
            {
                label: '健康指标',
                data: healthData.map(d => d.value),
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            }
        ]
    }), [healthData]);

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '健康数据趋势分析'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }), []);

    const stats = useMemo(() => {
        if (!healthData.length) return { avg: 0, max: 0, min: 0 };
        const values = healthData.map(d => d.value);
        return {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            max: Math.max(...values),
            min: Math.min(...values)
        };
    }, [healthData]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* 数据概览卡片 */}
                <Grid item xs={12} md={4}>
                    <HealthMetricCard
                        title="平均值"
                        value={stats.avg.toFixed(1)}
                        unit=""
                        trend={0}
                        status="normal"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <HealthMetricCard
                        title="最大值"
                        value={stats.max.toFixed(1)}
                        unit=""
                        trend={1}
                        status="success"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <HealthMetricCard
                        title="最小值"
                        value={stats.min.toFixed(1)}
                        unit=""
                        trend={-1}
                        status="warning"
                    />
                </Grid>

                {/* 图表控制区 */}
                <Grid item xs={12}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControl size="small">
                            <InputLabel></InputLabel>
                            <Select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                label="时间范围"
                            >
                                <MenuItem value="week"></MenuItem>
                                <MenuItem value="month"></MenuItem>
                                <MenuItem value="year"></MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* 趋势图表 */}
                <Grid item xs={12}>
                    <Card>
                        <Box p={2}>
                            <Line data={chartData} options={options} />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DataVisualization; 