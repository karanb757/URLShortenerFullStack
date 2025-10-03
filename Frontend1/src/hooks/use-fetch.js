// import {useState} from "react";

// const useFetch = (cb, options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(null);
//   const [error, setError] = useState(null);

//   const fn = async (...args) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await cb(options, ...args);
//       setData(response);
//       setError(null);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {data, loading, error, fn};
// };

// export default useFetch;


import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // If args are provided, use them; otherwise use options
      const params = args.length > 0 ? args[0] : options;
      const response = await cb(params, ...args.slice(1));
      
      setData(response.data || response);
      setError(response.error || null);
      
      return response;
    } catch (error) {
      console.error("useFetch error:", error);
      setError(error.message || error);
      return { data: null, error: error.message || error };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;