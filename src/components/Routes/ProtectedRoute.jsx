import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;