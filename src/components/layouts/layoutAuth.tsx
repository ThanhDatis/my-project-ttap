import { Outlet } from 'react-router-dom';

import { GuestGuard } from '../auth/guestGuard';

const LayoutAuth = () => {
  return (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  );
};

export default LayoutAuth;
