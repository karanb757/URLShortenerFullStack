// import apiClient from './apiClient';

// const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// // Create short URL
// export const createUrl = async ({ title, longUrl, customUrl, user_id }) => {
//   console.log("=== CREATE URL FUNCTION START ===");
//   console.log("1. Input params:", { title, longUrl, customUrl, user_id });
  
//   try {
//     console.log("2. Calling apiClient...");
//     const result = await apiClient('/urls', {
//       method: 'POST',
//       body: { 
//         title, 
//         longUrl, 
//         customUrl: customUrl || null 
//       },
//     });
    
//     console.log("3. apiClient returned:", result);
//     console.log("3a. result.data:", result.data);
//     console.log("3b. result.error:", result.error);
//     console.log("3c. Type of result:", typeof result);
//     console.log("3d. Is result null?", result === null);
//     console.log("3e. Is result.data null?", result.data === null);

//     const { data, error } = result;

//     if (error) {
//       console.error("4. Error path - Error creating URL:", error);
//       return { data: null, error };
//     }

//     if (!data) {
//       console.error("4. No data path - Data is null/undefined");
//       console.error("4a. Full result object:", JSON.stringify(result, null, 2));
//       return { data: null, error: "No data returned from API" };
//     }

//     console.log("5. Success path - URL created successfully:", data);
//     console.log("5a. data.short_url:", data.short_url);

//     // Format response to match frontend expectations
//     const formattedData = {
//       ...data,
//       short_url: `${APP_URL}/${data.short_url}`,
//     };

//     console.log("6. Formatted data:", formattedData);

//     const finalResult = { 
//       data: [formattedData], 
//       error: null 
//     };

//     console.log("7. Final return value:", finalResult);
//     console.log("=== CREATE URL FUNCTION END ===");
    
//     return finalResult;

//   } catch (err) {
//     console.error("=== EXCEPTION IN CREATE URL ===");
//     console.error("Exception:", err);
//     console.error("Exception message:", err.message);
//     console.error("Exception stack:", err.stack);
//     return { data: null, error: err.message };
//   }
// };

// // Get all URLs for user
// export const getUrls = async (user_id) => {
//   const { data, error } = await apiClient('/urls', {
//     method: 'GET',
//   });

//   if (error) {
//     return { data: null, error };
//   }

//   // Format URLs with full path
//   const formattedUrls = data.map(url => ({
//     ...url,
//     short_url: `${APP_URL}/${url.short_url}`,
//   }));

//   return { data: formattedUrls, error: null };
// };

// // Get single URL by ID
// export const getUrl = async (id) => {
//   const { data, error } = await apiClient(`/urls/${id}`, {
//     method: 'GET',
//   });

//   if (error) {
//     return { data: null, error };
//   }

//   return { 
//     data: [{
//       ...data,
//       short_url: `${APP_URL}/${data.short_url}`,
//     }], 
//     error: null 
//   };
// };

// // Delete URL
// export const deleteUrl = async (id) => {
//   const { data, error } = await apiClient(`/urls/${id}`, {
//     method: 'DELETE',
//   });

//   return { data, error };
// };

// // Update URL (if needed in future)
// export const updateUrl = async (id, updates) => {
//   const { data, error } = await apiClient(`/urls/${id}`, {
//     method: 'PUT',
//     body: updates,
//   });

//   if (error) {
//     return { data: null, error };
//   }

//   return { 
//     data: [{
//       ...data,
//       short_url: `${APP_URL}/${data.short_url}`,
//     }], 
//     error: null 
//   };
// };


// Get all URLs for user

import apiClient from './apiClient';

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// Create short URL
export async function createUrl({ title, longUrl, customUrl, user_id }) {
  console.log("=== CREATE URL FUNCTION START ===");
  console.log("1. Input params:", { title, longUrl, customUrl, user_id });
  
  try {
    console.log("2. Calling apiClient...");
    
    // Prepare the request body
    const requestBody = { 
      title: title || 'Untitled', 
      longUrl, 
      customUrl: customUrl || null 
    };
    
    console.log("2a. Request body:", requestBody);
    
    const result = await apiClient('/urls', {
      method: 'POST',
      body: requestBody,
    });
    
    console.log("3. apiClient returned:", result);
    console.log("3a. result.data:", result.data);
    console.log("3b. result.error:", result.error);

    const { data, error } = result;

    if (error) {
      console.error("4. Error path - Error creating URL:", error);
      return { data: null, error };
    }

    if (!data) {
      console.error("4. No data path - Data is null/undefined");
      return { data: null, error: "No data returned from API" };
    }

    console.log("5. Success path - URL created successfully:", data);

    // Format response to match frontend expectations
    const formattedData = {
      ...data,
      short_url: `${APP_URL}/${data.short_url}`,
    };

    console.log("6. Formatted data:", formattedData);

    const finalResult = { 
      data: [formattedData], 
      error: null 
    };

    console.log("7. Final return value:", finalResult);
    console.log("=== CREATE URL FUNCTION END ===");
    
    return finalResult;

  } catch (err) {
    console.error("=== EXCEPTION IN CREATE URL ===");
    console.error("Exception:", err);
    console.error("Exception message:", err.message);
    return { data: null, error: err.message || 'Failed to create URL' };
  }
}

// Get all URLs for user
export async function getUrls(user_id) {
  try {
    const { data, error } = await apiClient('/urls', {
      method: 'GET',
    });

    if (error) {
      return { data: null, error };
    }

    // Handle both array and paginated response
    const urls = Array.isArray(data) ? data : (data?.urls || []);

    // Format URLs with full path
    const formattedUrls = urls.map(url => ({
      ...url,
      short_url: `${APP_URL}/${url.short_url}`,
    }));

    return { data: formattedUrls, error: null };
  } catch (err) {
    console.error('Get URLs error:', err);
    return { data: null, error: err.message };
  }
}

// Get single URL by ID
export async function getUrl(id) {
  try {
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
  } catch (err) {
    console.error('Get URL error:', err);
    return { data: null, error: err.message };
  }
}

// Delete URL
export async function deleteUrl(id) {
  try {
    const { data, error } = await apiClient(`/urls/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Delete URL error:', err);
    return { data: null, error: err.message };
  }
}

// Update URL
export async function updateUrl(id, updates) {
  try {
    const { data, error } = await apiClient(`/urls/${id}`, {
      method: 'PUT',
      body: updates,
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
  } catch (err) {
    console.error('Update URL error:', err);
    return { data: null, error: err.message };
  }
}