import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Guards every /admin/* route. Customers are redirected to the customer Home
// page — the Admin Dashboard is never reachable without the "admin" role
// stored on the user's Firestore profile.
export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Verifying access…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
