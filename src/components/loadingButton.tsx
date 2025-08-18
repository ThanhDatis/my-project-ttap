import React from 'react';
import {
  Button,
  CircularProgress,
  type ButtonProps,
} from '@mui/material';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  loadingPosition?: 'start' | 'end' | 'center';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  loadingPosition = 'center',
  children,
  disabled,
  startIcon,
  endIcon,
  sx,
  ...buttonProps
}) => {
  const isDisabled = disabled || loading;

  const renderLoadingIcon = () => (
    <CircularProgress
      size={16}
      color="inherit"
      sx={{
        mr: loadingPosition === 'start' ? 1 : 0,
        ml: loadingPosition === 'end' ? 1 : 0,
      }}
    />
  );

  const getStartIcon = () => {
    if (loading && loadingPosition === 'start') {
      return renderLoadingIcon();
    }
    return startIcon;
  };

  const getEndIcon = () => {
    if (loading && loadingPosition === 'end') {
      return renderLoadingIcon();
    }
    return endIcon;
  };

  const getButtonContent = () => {
    if (loading && loadingPosition === 'center') {
      return (
        <>
          {renderLoadingIcon()}
          {loadingText && <span style={{ marginLeft: 8 }}>{loadingText}</span>}
        </>
      );
    }

    if (loading && loadingText) {
      return loadingText;
    }

    return children;
  };

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      startIcon={getStartIcon()}
      endIcon={getEndIcon()}
      sx={{
        position: 'relative',
        ...sx,
      }}
    >
      {getButtonContent()}
    </Button>
  );
};

export default LoadingButton;
