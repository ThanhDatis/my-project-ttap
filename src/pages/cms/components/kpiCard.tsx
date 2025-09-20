import {
  Box,
  Card,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import React from 'react';

import { formatNumber } from '../../../utils';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  isLoading = false,
  subtitle,
  prefix = '',
  suffix = '',
  trend,
}) => {
  const theme = useTheme();

  const getColorConfig = () => {
    switch (color) {
      case 'success':
        return {
          iconBg: '#e8f5e8',
          iconColor: '#2e7d32',
          valueColor: '#2e7d32',
        };
      case 'warning':
        return {
          iconBg: '#fff8e1',
          iconColor: '#f57c00',
          valueColor: '#f57c00',
        };
      case 'error':
        return {
          iconBg: '#ffebee',
          iconColor: '#d32f2f',
          valueColor: '#d32f2f',
        };
      case 'info':
        return {
          iconBg: '#e3f2fd',
          iconColor: '#1976d2',
          valueColor: '#1976d2',
        };
      case 'secondary':
        return {
          iconBg: '#f3e5f5',
          iconColor: '#7b1fa2',
          valueColor: '#7b1fa2',
        };
      default:
        return {
          iconBg: '#e3f2fd',
          iconColor: '#1976d2',
          valueColor: '#1976d2',
        };
    }
  };

  const colorConfig = getColorConfig();

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    return formatNumber(val);
  };

  const displayValue = isLoading
    ? '...'
    : `${prefix}${formatValue(value)}${suffix}`;

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: colorConfig.iconBg,
            color: colorConfig.iconColor,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading ? <CircularProgress size={24} color={color} /> : icon}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontWeight: 500 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colorConfig.valueColor,
              lineHeight: 1.2,
            }}
          >
            {displayValue}
          </Typography>
        </Box>
      </Box>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}

      {trend && !isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: trend.isPositive ? '#2e7d32' : '#d32f2f',
              fontWeight: 600,
              mr: 1,
            }}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trend.period}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default KpiCard;
