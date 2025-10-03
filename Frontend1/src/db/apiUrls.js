import apiClient from './apiClient';

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// Create short URL
export const createUrl = async ({ title, longUrl, customUrl, user_id }) => {
  const { data, error } = await apiClient('/urls', {
    method: 'POST',
    body: JSON.stringify({ 
      title, 
      longUrl, 
      customUrl: customUrl || null 
    }),
  });

  if (error) {
    return { data: null, error };
  }

  // Format response to match frontend expectations
  return { 
    data: [{
      ...data,
      short_url: `${APP_URL}/${data.short_url}`,
    }], 
    error: null 
  };
};

// Get all URLs for user
export const getUrls = async (user_id) => {
  const { data, error } = await apiClient('/urls', {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  // Format URLs with full path
  const formattedUrls = data.map(url => ({
    ...url,
    short_url: `${APP_URL}/${url.short_url}`,
  }));

  return { data: formattedUrls, error: null };
};

// Get single URL by ID
export const getUrl = async (id) => {
  const { data, error } = await apiClient(`/urls/${id}`, {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  return { 
    data: [{
      ...data,
      short_url: `${APP_URL}/${data.short_url}`,
    }], 
    error: null 
  };
};

// Delete URL
export const deleteUrl = async (id) => {
  const { data, error } = await apiClient(`/urls/${id}`, {
    method: 'DELETE',
  });

  return { data, error };
};

// Update URL (if needed in future)
export const updateUrl = async (id, updates) => {
  const { data, error } = await apiClient(`/urls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  if (error) {
    return { data: null, error };
  }

  return { 
    data: [{
      ...data,
      short_url: `${APP_URL}/${data.short_url}`,
    }], 
    error: null 
  };
};