import React, { createContext, useContext, useState } from 'react';

export const cartContext = createContext(null);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('x-auth-token'));
  
  // Optionally update the authentication status
  const login = (token) => {
    localStorage.setItem('x-auth-token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);

    // Force a page refresh
  window.location.reload();

  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const showCart = createContext(false);

export const buy = createContext([{}]);
