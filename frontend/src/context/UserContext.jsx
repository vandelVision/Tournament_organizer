import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start as true since auth check runs immediately

  useEffect(() => {
    const fetchAuthCheck = async () => {
      try {
        const res = await api.checkAuth();
        if (res && res.status === "success") {
          setUser(res.details);
          setIsAuthenticated(res.isAuthenticated);
        } else {
          // API returned but status is not success
          setUser(null);
          setIsAuthenticated(false);
          console.log(
            "Auth Check Failed:",
            res?.message || "Authentication failed"
          );
        }
      } catch (error) {
        // Network error or API error
        console.log("Error authCheck:", error.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthCheck();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
