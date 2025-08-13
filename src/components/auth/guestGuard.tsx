import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useState, useEffect, Component } from "react";
import { Navigate, useLocation } from 'react-router-dom';
// import { paths } from "../../path.config";

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({
  children,
  redirectTo = '/dashboard',
}) => {
  const { isAuthenticated, checkAuth, setLoading, isLoading } = useAuthStore();
  const [ isChecking, setIsChecking ] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyGuest = async () => {
      setLoading(true);

      try {
        const isAuth = checkAuth();

        setIsChecking(false);
        setLoading(false);
      } catch (error) {
        console.error('Guest verification error:', error);
        setIsChecking(false);
        setLoading(false);
      }
    };
    verifyGuest();
  }, [checkAuth, setLoading]);

  if (isChecking || isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export const withAuthGuard = (
  Component: React.ComponentType,
  redirectTo?: string
) => {
  const WrappedComponent = (props: any) => (
    <GuestGuard redirectTo={redirectTo}>
      <Component {...props} />
    </GuestGuard>
  );

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
