import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="access-denied">
        <h2>⛔ Accès refusé</h2>
        <p>Vous devez être membre de la commission administration pour accéder à cette page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
