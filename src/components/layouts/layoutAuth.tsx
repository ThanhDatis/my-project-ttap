import { GuestGuard } from "../auth/guestGuard";
import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  );
};

export default LayoutAuth;
