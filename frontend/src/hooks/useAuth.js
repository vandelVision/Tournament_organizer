import { useUser } from '../context/UserContext';
import { api } from '../services/api';

export const useAuth = () => {
    const { setUser, setIsAuthenticated } = useUser();
    
    const login = async (data) => {
        const res = await api.loginPlayer(data);
        res.details.role = res?.role;
        setUser(res.details);
        setIsAuthenticated(true);
        return res;
    };
    
    const signup = async (data) => {
        const res = await api.signupPlayer(data);
        return res;
    };
    
    const logout = async () => {
        const res = await api.logoutPlayer();
        setUser(null);
        setIsAuthenticated(false);
        return res;
    };
    
    const hostLogin = async (data) => {
        const res = await api.loginHost(data);
        res.details.role = res?.role;
        setUser(res.details);
        setIsAuthenticated(true);
        return res;
    };
    
    const hostSignup = async (data) => {
        const res = await api.signupHost(data);
        return res;
    };
    
    const checkAuth = async () => {
        const res = await api.checkAuth();
        res.details.role = res?.role;
        setUser(res.details);
        setIsAuthenticated(true);
        return res;
    };
    
    return { login, signup, logout, hostLogin, hostSignup, checkAuth };
};
