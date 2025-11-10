import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
