// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const RedirectLink = () => {
//   const { id } = useParams();

//   useEffect(() => {
//     // Redirect happens on the backend
//     // Just redirect the browser to the backend route
//     const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
//     window.location.href = `${APP_URL}/${id}`;
//   }, [id]);

//   return (
//     <>
//       <BarLoader width={"100%"} color="#36d7b7" />
//       <br />
//       Redirecting...
//     </>
//   );
// };

// export default RedirectLink;

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  useEffect(() => {
    // Use the correct backend URL for production
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
    console.log('Redirecting to:', `${APP_URL}/${id}`);
    window.location.href = `${APP_URL}/${id}`;
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      <p>Redirecting...</p>
    </div>
  );
};

export default RedirectLink;