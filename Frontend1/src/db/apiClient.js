const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Base fetch wrapper
const apiClient = async (endpoint, options = {}) => {
  const token = getToken();
  
  // Debugging: Log the token to ensure it's being retrieved
  console.log('Token retrieved from localStorage:', token);

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Response Error:', data); // Log the full response for debugging
      throw new Error(data.error || 'Something went wrong');
    }

    return { data, error: null };
  } catch (error) {
    console.error('API Client Error:', error.message); // Log the error for debugging
    return { data: null, error: error.message };
  }
};

export default apiClient;