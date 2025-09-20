/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/cms/components/lowStockList.tsx
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  CircularProgress,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import React from 'react';

import type { LowStockProduct } from '../../../lib/dashboard.repo';
import { formatNumber } from '../../../utils';

interface LowStockListProps {
  products: LowStockProduct[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewProduct?: (productId: string) => void;
  threshold?: number;
}

const getStockColor = (stock: number, threshold: number = 5) => {
  if (stock === 0) return 'error';
  if (stock <= threshold / 2) return 'warning';
  return 'default';
};

const getStockIcon = (stock: number) => {
  if (stock === 0) {
    return <WarningRoundedIcon color="error" />;
  }
  return <InventoryRoundedIcon color="action" />;
};

export const LowStockList: React.FC<LowStockListProps> = ({
  products,
  isLoading = false,
  onRefresh,
  onViewProduct,
  threshold = 5,
}) => {
  if (isLoading) {
    return (
      <Card sx={{ p: 3, height: 400 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= threshold,
  ).length;

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Low Stock Alert
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
                <RefreshRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {products.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <InventoryRoundedIcon
              sx={{ fontSize: 48, color: 'success.main', mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              All products are well-stocked!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No products below {threshold} items in stock
            </Typography>
          </Box>
        ) : (
          <>
            {(outOfStockCount > 0 || lowStockCount > 0) && (
              <Alert
                severity={outOfStockCount > 0 ? 'error' : 'warning'}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  {outOfStockCount > 0 && (
                    <>
                      <strong>{outOfStockCount}</strong> product
                      {outOfStockCount !== 1 ? 's' : ''} out of stock
                      {lowStockCount > 0 && ', '}
                    </>
                  )}
                  {lowStockCount > 0 && (
                    <>
                      <strong>{lowStockCount}</strong> product
                      {lowStockCount !== 1 ? 's' : ''} running low
                    </>
                  )}
                </Typography>
              </Alert>
            )}

            <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
              {products.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem
                    sx={{
                      cursor: onViewProduct ? 'pointer' : 'default',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => onViewProduct?.(product.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getStockIcon(product.stock)}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={product.name}
                          >
                            {product.name}
                          </Typography>

                          <Chip
                            label={`${formatNumber(product.stock)} left`}
                            size="small"
                            color={
                              getStockColor(product.stock, threshold) as any
                            }
                            variant={
                              product.stock === 0 ? 'filled' : 'outlined'
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            SKU: {product.sku || 'N/A'}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>

                          <Chip
                            label={product.category}
                            size="small"
                            variant="outlined"
                            sx={{
                              textTransform: 'capitalize',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>

                  {index < products.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Box>

      {products.length > 0 && (
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              // Navigate to products page with low stock filter
              window.location.href = '/products?filter=low-stock';
            }}
          >
            View All Products
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default LowStockList;
