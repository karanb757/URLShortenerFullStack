import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  useEffect(() => {
    // Redirect happens on the backend
    // Just redirect the browser to the backend route
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
    window.location.href = `${APP_URL}/${id}`;
  }, [id]);

  return (
    <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting...
    </>
  );
};

export default RedirectLink;