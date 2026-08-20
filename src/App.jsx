import { Routes, Route } from 'react-router-dom';

import CustomerLayout from './layouts/CustomerLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import Home from './pages/customer/Home';
import About from './pages/customer/About';
import PrivacyPolicy from './pages/customer/PrivacyPolicy';
import History from './pages/customer/History';
import OrderDetails from './pages/customer/OrderDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Account from './pages/customer/Account';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';

import Dashboard from './pages/admin/Dashboard';
import ManageDrinks from './pages/admin/ManageDrinks';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';
import AdminAccount from './pages/admin/AdminAccount';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public + customer routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/history/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="drinks" element={<ManageDrinks />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="account" element={<AdminAccount />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
