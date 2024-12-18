import React from 'react';

import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Card, Box, Typography } from '@mui/material';

interface IHealthMetricProps {
    /** title 的描述 */
    title: string;
    /** value 的描述 */
    value: string  /** number 的描述 */
    /** number 的描述 */
    number;
    /** unit 的描述 */
    unit: string;
    /** trend 的描述 */
    trend: number;
    /** status 的描述 */
    status: success  warning  error  normal;
}

export const HealthMetricCard: React.FC<IHealthMetricProps> = ({
    title,
    value,
    unit = '',
    trend = 0,
    status = 'normal'
}) => {
    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return '#4caf50';
            case 'warning':
                return '#ff9800';
            case 'error':
                return '#f44336';
            default:
                return '#2196f3';
        }
    };

    const getTrendIcon = () => {
        if (trend > 0) return <TrendingUpIcon color="success" />;
        if (trend < 0) return <TrendingDownIcon color="error" />;
        return <TrendingFlatIcon color="action" />;
    };

    return (
        <Card>
            <Box p={2}>
                <Typography variant="subtitle2" color="textSecondary">
                    {title}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="h4" style={{ color getStatusColor }}>
                        {value}
                        {unit}
                    </Typography>
                    <Box ml={1}>
                        {getTrendIcon}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};
