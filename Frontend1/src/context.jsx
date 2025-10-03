import { createContext, useContext, useEffect, useCallback } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const { data: userData, loading, fn: fetchUser } = useFetch(getCurrentUser);
  
  // Extract the actual user object from the nested structure
  const user = userData?.data?.user || userData?.user || null;
  const isAuthenticated = !!user?.id || !!localStorage.getItem('token');

  // ✅ Wrap fetchUser in useCallback to prevent it from changing on every render
  const stableFetchUser = useCallback(() => {
    return fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    stableFetchUser();
  }, []);

  useEffect(() => {
    stableFetchUser().then(res => {
      if (!res?.data?.user && !res?.data?.data?.user) {
        localStorage.removeItem('token'); // Clear localStorage if API fails
      }
    });
  }, []);

  return (
    <UrlContext.Provider value={{ 
      user, 
      fetchUser: stableFetchUser, // ✅ Use stable version
      loading, 
      isAuthenticated 
    }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;