import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: string[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, roles }) => {
  const { isAuthenticated, user, checkAuth, setLoading, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () =>{
      setLoading(true);

      try {
        const isAuth = checkAuth();

        if (!isAuth) {
          setIsChecking(false);
          setLoading(false);
          return;
        }

        setIsChecking(false);
        setLoading(false);
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsChecking(false);
        setLoading(false);
      }
    };
    verifyAuth();
  }, [checkAuth, setLoading]);

  if (isLoading || isChecking) {
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

  if (!isAuthenicated) {
    return (
      <Navigate
        to='/auth/login'
        state={{ from : location }}
        replace
      />
    );
  }

  if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) {
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
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You do not have permission to view this page
          </Typography>
        </Box>
      );
    }
  }
  return <>{children}</>;
};

export const withAuthGuard = (
  Component: React.ComponentType,
  roles?: string[]
) => {
  const WrappedComponent = (props: any) => (
    <AuthGuard roles={roles}>
      <Component {...props} />
    </AuthGuard>
  );

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
