import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LayoutDashboard from '../components/layouts/layoutDashboard';
import Dashboard from '../pages/cms/dashboard';
import Customers from '../pages/cms/customers';
import Orders from '../pages/cms/orders';
import Setting from '../pages/cms/setting';
import Profile from '../pages/cms/profile';

import { SignIn, SignUp } from '../pages/auth';

import { AuthGuard } from '../components/auth/authGuard';
import { GuestGuard } from '../components/auth/guestGuard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <GuestGuard>
              <SignIn />
            </GuestGuard>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          }
        />

        <Route
          path="/auth"
          element={<Navigate to="/auth/signin" replace />}
        />

        <Route path="/"
          element={
            <AuthGuard>
              <LayoutDashboard />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="setting" element={<Setting />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AuthGuard roles={['admin', 'super_admin']}>
              <LayoutDashboard />
            </AuthGuard>
          }
        >
          <Route path="users" element={
            <div style={{ padding: '20px' }}>
              <h2>Admin - User Management</h2>
              <p>Chỉ admin mới có thể truy cập trang này.</p>
            </div>
          } />
          <Route path="system" element={
            <div style={{ padding: '20px' }}>
              <h2>Admin - System Settings</h2>
              <p>Cấu hình hệ thống dành cho admin.</p>
            </div>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '14px',
        }}
      />
    </BrowserRouter>
  );
};

export default AppRouter;
