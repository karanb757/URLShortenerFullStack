// import { Copy, Download, Trash } from "lucide-react";
// import { Link } from "react-router-dom";
// import useFetch from "@/hooks/use-fetch";
// import { deleteUrl } from "@/db/apiUrls";

// const LinkCard = ({ url = {}, fetchUrls }) => {
//   const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

//   const downloadImage = () => {
//     const imageUrl = url?.qr;
//     const fileName = url?.title || "qr-code";

//     const anchor = document.createElement("a");
//     anchor.href = imageUrl;
//     anchor.download = fileName;
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//   };

//   // Determine URLs
//   const displayUrl = url?.custom_url ? url.custom_url : url.short_url;
//   const copyUrl = displayUrl;

//   return (
//     <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border p-4 sm:p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
//       {/* QR Image */}
//       <img
//         src={url?.qr}
//         className="h-28 w-28 sm:h-24 sm:w-24 object-contain ring ring-[#7f57f1] rounded-md mx-auto sm:mx-0"
//         alt="qr code"
//       />

//       {/* URL Details */}
//       <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-1 text-center sm:text-left">
//         <span className="text-2xl sm:text-3xl font-extrabold break-words">
//           {url?.title}
//         </span>

//         <span className="text-lg sm:text-2xl text-[#7f57f1] font-bold break-all hover:underline">
//           {displayUrl}
//         </span>

//         <span className="text-sm sm:text-base text-gray-600 break-all hover:underline">
//           {url?.original_url}
//         </span>

//         <span className="text-xs sm:text-sm text-gray-400 mt-1">
//           {new Date(url?.created_at).toLocaleString()}
//         </span>
//       </Link>

//       {/* Action Buttons */}
//       <div className="flex justify-center sm:justify-start gap-3 mt-2 sm:mt-0">
//         <button
//           className="p-2 rounded-full "
//           onClick={() => navigator.clipboard.writeText(copyUrl)}
//         >
//           <Copy className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
//         </button>

//         <button
//           className="p-2 rounded-full transition"
//           onClick={downloadImage}
//         >
//           <Download className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
//         </button>

//         <button
//           className="p-2 rounded-full transition disabled:opacity-50"
//           onClick={() => fnDelete().then(() => fetchUrls())}
//           disabled={loadingDelete}
//         >
//           <Trash className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LinkCard;




import { Copy, Download, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";

const LinkCard = ({ url = {}, fetchUrls }) => {
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "qr-code";

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Get the backend URL for actual redirects
  const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
  
  // Determine the short code (without the full URL)
  const shortCode = url?.custom_url || url?.short_url?.split('/').pop();
  
  // Full redirect URL that points to backend
  const redirectUrl = `${APP_URL}/${shortCode}`;
  
  // Display URL (for showing to user)
  const displayUrl = url?.custom_url ? url.custom_url : url.short_url;
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border p-4 sm:p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* QR Image */}
      <img
        src={url?.qr}
        className="h-28 w-28 sm:h-24 sm:w-24 object-contain ring ring-[#7f57f1] rounded-md mx-auto sm:mx-0"
        alt="qr code"
      />

      {/* URL Details */}
      <div className="flex flex-col flex-1 gap-1 text-center sm:text-left">
        {/* Title - Link to details page */}
        <Link to={`/link/${url?.id}`} className="text-2xl sm:text-3xl font-extrabold break-words hover:underline">
          {url?.title}
        </Link>

        {/* Shortened URL - Use regular anchor tag for proper redirects */}
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg sm:text-2xl text-[#7f57f1] font-bold break-all hover:underline"
        >
          {displayUrl}
        </a>

        {/* Original URL */}
        <a
          href={url?.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm sm:text-base text-gray-600 break-all hover:underline"
        >
          {url?.original_url}
        </a>

        <span className="text-xs sm:text-sm text-gray-400 mt-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center sm:justify-start gap-3 mt-2 sm:mt-0">
        <button
          className="p-2 rounded-full"
          onClick={() => navigator.clipboard.writeText(redirectUrl)}
          title="Copy link"
        >
          <Copy className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
        </button>

        <button
          className="p-2 rounded-full transition"
          onClick={downloadImage}
          title="Download QR"
        >
          <Download className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
        </button>

        <button
          className="p-2 rounded-full transition disabled:opacity-50"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
          title="Delete link"
        >
          <Trash className="w-4 h-4 hover:scale-110 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
