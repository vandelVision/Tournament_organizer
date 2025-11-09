import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);

export default UserProvider;