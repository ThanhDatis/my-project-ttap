import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Box, Typography, type SvgIconProps, type SxProps } from '@mui/material';
import React from 'react';
import { ToastContainer, toast, type Id, type ToastOptions } from 'react-toastify';

import { errorColor, gray, successColor, warningColor } from '../common/color';
import 'react-toastify/dist/ReactToastify.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

const icons: Record<ToastType, React.ElementType<SvgIconProps>> = {
  success: CheckCircleRoundedIcon,
  error: NewReleasesRoundedIcon,
  info: InfoRoundedIcon,
  warning: WarningRoundedIcon,
};

const iconsColor: Record<ToastType, string> = {
  success: successColor,
  error: errorColor,
  info: gray[500],
  warning: warningColor,
};

interface ToastIconProps {
  status: ToastType;
  sx?: SxProps;
}

const ToastIcon: React.FC<ToastIconProps> = ({ status, sx }) => {
  const IconComponent = icons[status] || CheckCircleRoundedIcon;

  return (
    <IconComponent
      sx={{
        color: iconsColor[status],
        width: 24,
        height: 24,
        ...sx,
      }}
    />
  );
};

interface ToastContentProps {
  message: string;
  status: ToastType;
}

const ToastContent: React.FC<ToastContentProps> = ({ message, status }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <ToastIcon status={status} />
      <Typography fontSize={15} fontWeight={500} color="#000">
        {message}
      </Typography>
    </Box>
  );
};

const CustomCloseButton = ({ closeToast }: { closeToast?: () => void }) => (
  <CloseRoundedIcon
    onClick={() => closeToast?.()}
    sx={{
      width: 16,
      height: 16,
      color: 'white',
      cursor: 'pointer',
      position: 'absolute',
      top: '6px',
      right: '6px',
    }}
  />
);

interface CustomToastOptions extends Omit<ToastOptions, 'type' | 'autoClose'> {
  navigate?: () => void;
}

export const ToastMessage = (type: ToastType, message: string, options?: CustomToastOptions): Id => {
  return toast(<ToastContent message={message} status={type} />, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
    style: {
      backgroundColor: 'white',
      color: 'black',
      padding: '6px 12px',
      boxShadow:
        '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    },
    onClick: () => {
      if (options?.navigate) {
        options.navigate();
      }
    },
    ...options,
  });
};

export const ToastContainerComponent: React.FC = () => {
  return (
    <ToastContainer
      stacked
      pauseOnHover
      autoClose={5000}
      newestOnTop={false}
      closeButton={CustomCloseButton}
      closeOnClick={false}
      pauseOnFocusLoss
      draggable
      position="top-right"
      style={{ zIndex: 9999 }}
    />
  );
};

export { ToastIcon };
export default ToastMessage;
