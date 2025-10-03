import apiClient, { setToken, removeToken } from './apiClient';

// Signup
export const signup = async ({ email, password, name, profile_pic }) => {
  const { data, error } = await apiClient('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, profile_pic }),
  });

  if (error) {
    return { data: null, error };
  }

  // Store token
  setToken(data.token);

  return { 
    data: { 
      user: data.user, 
      session: { access_token: data.token } 
    }, 
    error: null 
  };
};

// Login
export const login = async ({ email, password }) => {
  const { data, error } = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (error) {
    return { data: null, error };
  }

  // Store token
  setToken(data.token);

  return { 
    data: { 
      user: data.user, 
      session: { access_token: data.token } 
    }, 
    error: null 
  };
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return { data: { user: null }, error: 'No token found', loading: false };
  }

  const { data, error } = await apiClient('/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (error) {
    if (error.includes('Unauthorized')) {
      removeToken(); // clear invalid token
    }
    return { data: { user: null }, error, loading: false };
  }

  return { data: { user: data }, error: null, loading: false };
};

// Logout
export const logout = async () => {
  removeToken();
  return { error: null };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};