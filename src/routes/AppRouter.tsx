import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LayoutDashboard from '../components/layouts/layoutDashboard';
import Dashboard from '../pages/dashboard';
import Customers from '../pages/customers';
import Orders from '../pages/orders';
import Setting from '../pages/setting';
import Profile from '../pages/profile';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutDashboard />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="setting" element={<Setting />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
