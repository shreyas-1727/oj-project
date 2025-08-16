import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../api/authService';

//  Creating the context
const AuthContext = createContext();

// Creating the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To check auth status on page load

  useEffect(() => {
    // Checking if the user is already authenticated when the app loads
    const checkAuthStatus = async () => {
      try {
        // The server will check the httpOnly cookie
        const response = await axios.get('http://localhost:7000/api/auth/profile', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        //setLoading(false);
        // This will only be set to false on the very first load
        if (loading) setLoading(false);
      }
    };
    // Checking status immediately on load
    checkAuthStatus();

    // Setting up an interval to check every 5 minutes
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000); // 5 minutes

    // Cleaning up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [loading]);//`loading` to the dependency array is added to control the initial load state

  const login = (userData) => {
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    console.log("2. Reached logout function in AuthContext.");
    try {
      await authService.logout();
      console.log("3. Backend logout successful. Clearing frontend state.");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed in AuthContext:', error);
    }
  };

  const decrementAiCredits = () => {
    setUser((prevUser) => ({
      ...prevUser,
      aiCredits: prevUser.aiCredits - 1,
    }));
  };

  // Passing down the state and functions
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, decrementAiCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };