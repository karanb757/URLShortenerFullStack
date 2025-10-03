import { createContext, useContext, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);
  const isAuthenticated = !!user?.id || !!localStorage.getItem('token');

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUser().then(res => {
      if (!res?.data) {
        localStorage.removeItem('token'); // Clear localStorage if API fails
      }
    });
  }, []);

  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;