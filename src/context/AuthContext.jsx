import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll use mock user data
          const mockUser = {
            id: 'user-1',
            name: 'John Smith',
            email: 'demo@cfsbrands.com',
            roles: ['ADMIN'] // This would come from your JWT token
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call to your backend
      if (email === "demo@cfsbrands.com" && password === "password123") {
        const mockUser = {
          id: 'user-1',
          name: 'John Smith',
          email: email,
          roles: ['ADMIN']
        };
        
        // Store auth token (in real app, this would come from backend)
        localStorage.setItem('authToken', 'mock-jwt-token');
        setUser(mockUser);
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};