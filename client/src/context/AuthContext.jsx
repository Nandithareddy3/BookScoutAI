// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- THIS IS THE KEY FIX ---
  // 'isAuthenticated' is no longer a separate 'useState'.
  // It is now *derived* from whether a token exists.
  // This prevents the state from ever being out of sync.
  const isAuthenticated = !!token; 

  // Check local storage for a token when the app first loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');

    if (storedToken && storedName) {
      setToken(storedToken);
      setUserName(storedName);
      // We no longer need to set isAuthenticated, it's automatic
    }
    setIsLoading(false); // Finished checking
  }, []);

  // Login function
  const login = (newToken, newName) => {
    setToken(newToken);
    setUserName(newName);
    // We no longer need to set isAuthenticated
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newName);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUserName(null);
    // We no longer need to set isAuthenticated
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  };

  // The value that will be "provided"
  const value = {
    token,
    userName,
    isAuthenticated, // This is now our derived boolean
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 3. Create the custom hook (no change)
export function useAuth() {
  return useContext(AuthContext);
}