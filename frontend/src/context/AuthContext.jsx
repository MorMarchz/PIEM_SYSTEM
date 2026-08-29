import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessTokenInMemory, getAccessTokenFromMemory } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => getAccessTokenFromMemory());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set or clear session state
  const updateSession = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setAccessTokenInMemory(token);
  };

  // Fetch Current User Profile
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.data.user);
      }
    } catch (err) {
      console.warn('[AuthContext]: Failed to fetch user profile:', err.message);
    }
  }, []);

  // Check auth status on app load (Silent Refresh)
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAccessTokenFromMemory();
      if (token) {
        setAccessTokenInMemory(token);
        await fetchCurrentUser();
      } else {
        // Attempt silent refresh using HTTP-Only cookie
        const refreshResponse = await api.post('/auth/refresh');
        if (refreshResponse.data?.success) {
          const newToken = refreshResponse.data.data.access_token;
          const userData = refreshResponse.data.data.user;
          updateSession(userData, newToken);
        }
      }
    } catch (err) {
      updateSession(null, null);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    checkAuthStatus();

    const handleUnauthorized = () => {
      updateSession(null, null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [checkAuthStatus]);

  // Login Handler
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { access_token, user: userData } = response.data.data;
        updateSession(userData, access_token);
        return { success: true, user: userData };
      }
      throw new Error(response.data?.message || 'Login failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred during login';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Register Handler
  const register = async (email, password, display_name) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', { email, password, display_name });
      if (response.data?.success) {
        return { success: true, data: response.data.data };
      }
      throw new Error(response.data?.message || 'Registration failed');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred during registration';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthContext]: Logout API warning:', err.message);
    } finally {
      updateSession(null, null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(user || accessToken),
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
