import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import LayoutAuth from '../components/layouts/layoutAuth';
import LayoutDashboard from '../components/layouts/layoutDashboard';
import { ToastContainerComponent } from '../components/toastMessage';
import ForgotPassword from '../pages/auth/forgotPassword';
import SignIn from '../pages/auth/signIn';
import SignUp from '../pages/auth/signUp';
import Customers from '../pages/cms/customers';
import Dashboard from '../pages/cms/dashboard';
import Employees from '../pages/cms/employees';
import Orders from '../pages/cms/orders';
import Products from '../pages/cms/products';
import Profile from '../pages/cms/profile';
import Setting from '../pages/cms/setting';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LayoutAuth />}>
          <Route index element={<Navigate to="signIn" replace />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/" element={<LayoutDashboard />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="employees" element={<Employees />} />
          <Route path="setting" element={<Setting />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>

      <ToastContainerComponent />
    </BrowserRouter>
  );
};

export default AppRouter;
