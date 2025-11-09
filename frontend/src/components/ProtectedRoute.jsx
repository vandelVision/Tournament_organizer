import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";


const ProtectedRoute = ({children})=>{
  const { isAuthenticated, user, setUser, loading, setLoading, setIsAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to="/login" replace/>;
}

export default ProtectedRoute;