import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LayoutAuth from '../components/layouts/layoutAuth';
import LayoutDashboard from '../components/layouts/layoutDashboard';
import Dashboard from '../pages/cms/dashboard';
import Customers from '../pages/cms/customers';
import Orders from '../pages/cms/orders';
import Setting from '../pages/cms/setting';
import Profile from '../pages/cms/profile';

import SignIn from '../pages/auth/signIn';
import SignUp from '../pages/auth/signUp';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LayoutAuth />}>
          <Route index element={<Navigate to='signIn' replace />} />
          <Route path='signin' element={<SignIn />}/>
          <Route path='signup' element={<SignUp />}/>
        </Route>

        <Route path="/" element={<LayoutDashboard /> }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="setting" element={<Setting />} />
          <Route path="profile" element={<Profile />} />
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
