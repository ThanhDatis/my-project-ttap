import { Box, Breadcrumbs, Typography, Link } from "@mui/material";
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  orders: 'Orders',
  setting: 'Setting',
  profile: 'Profile',
}

const BreadcrumbPage = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (pathSegments[0] !== 'dashboard') {
      breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
    }

    if (pathSegments.length > 0) {
      const currentSegment = pathSegments[0];
      const label = routeLabels[currentSegment] || currentSegment;

      if (currentSegment === 'dashboard') {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label });
      }
    }
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' sx={{ color: '#999' }} />}
        sx={{
          '& .MuiBreadcrumbs-separator': { mx: 1 }
        }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast || !breadcrumb.path) {
            return (
              <Typography
                key={breadcrumb.label}
                sx={{
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '16px',
                }}
              >
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.label}
              component={RouterLink}
              to={breadcrumb.path}
              sx={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '16px',
                '&:hover': {
                  color: '#757575',
                  textDecoration: 'underline',
                },
              }}
            >
              {breadcrumb.label}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbPage;
