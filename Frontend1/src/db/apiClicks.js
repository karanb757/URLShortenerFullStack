import apiClient from './apiClient';

// Get clicks for a URL
export const getClicksForUrl = async (url_id) => {
  const { data, error } = await apiClient(`/analytics/clicks/${url_id}`, {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

// Get device stats for a URL
export const getDeviceStats = async (url_id) => {
  const { data, error } = await apiClient(`/analytics/device/${url_id}`, {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

// Get location stats for a URL
export const getLocationStats = async (url_id) => {
  const { data, error } = await apiClient(`/analytics/location/${url_id}`, {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

// Get overall user analytics (optional)
export const getUserAnalytics = async () => {
  const { data, error } = await apiClient('/analytics/user', {
    method: 'GET',
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};