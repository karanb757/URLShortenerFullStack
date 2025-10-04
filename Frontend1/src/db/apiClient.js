// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// // Get token from localStorage
// const getToken = () => {
//   return localStorage.getItem('token');
// };

// // Set token in localStorage
// export const setToken = (token) => {
//   localStorage.setItem('token', token);
// };

// // Remove token from localStorage
// export const removeToken = () => {
//   localStorage.removeItem('token');
// };

// // Base fetch wrapper
// const apiClient = async (endpoint, options = {}) => {
//   const token = getToken();
  
//   console.log('=== API Client Call ===');
//   console.log('Endpoint:', `${API_URL}${endpoint}`);
//   console.log('Method:', options.method || 'GET');
//   console.log('Token:', token ? 'Present' : 'Missing');
//   console.log('Body (before stringify):', options.body);

//   const config = {
//     method: options.method || 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//   };

//   // ✅ IMPORTANT: Only stringify if body is NOT already a string
//   if (options.body) {
//     if (typeof options.body === 'string') {
//       config.body = options.body;
//     } else {
//       config.body = JSON.stringify(options.body);
//     }
//     console.log('Stringified body:', config.body);
//   }

//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, config);
//     console.log('Response status:', response.status);
    
//     // Handle non-JSON responses (like redirects)
//     const contentType = response.headers.get('content-type');
//     if (!contentType || !contentType.includes('application/json')) {
//       if (response.ok) {
//         return { data: { success: true }, error: null };
//       }
//       const text = await response.text();
//       console.error('Non-JSON response:', text);
//       throw new Error('Invalid response from server');
//     }

//     const data = await response.json();
//     console.log('Response data:', data);

//     if (!response.ok) {
//       console.error('API Response Error:', data);
//       throw new Error(data.error || data.message || 'Something went wrong');
//     }

//     console.log('=== API Call Success ===');
//     return { data, error: null };
//   } catch (error) {
//     console.error('=== API Client Error ===');
//     console.error('Error message:', error.message);
//     return { data: null, error: error.message };
//   }
// };

// export default apiClient;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API_URL:', API_URL);

const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

const apiClient = async (endpoint, options = {}) => {
  const token = getToken();
  
  console.log('=== API Client Call ===');
  console.log('Endpoint:', `${API_URL}${endpoint}`);
  console.log('Method:', options.method || 'GET');

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body) {
    if (typeof options.body === 'string') {
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    console.log('Response status:', response.status);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return { data: { success: true }, error: null };
      }
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(text || 'Invalid response from server');
    }

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('API Response Error:', data);
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    console.log('=== API Call Success ===');
    return { data, error: null };
  } catch (error) {
    console.error('=== API Client Error ===');
    console.error('Error message:', error.message);
    return { data: null, error: error.message };
  }
};

export default apiClient;