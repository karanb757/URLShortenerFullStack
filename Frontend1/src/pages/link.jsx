// import DeviceStats from "@/components/device-stats";
// import Location from "@/components/location-stats";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { UrlState } from "@/context";
// import { getClicksForUrl } from "@/db/apiClicks";
// import { deleteUrl, getUrl } from "@/db/apiUrls";
// import useFetch from "@/hooks/use-fetch";
// import { Copy, Download, LinkIcon, Trash } from "lucide-react";
// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const LinkPage = () => {
//   const downloadImage = () => {
//     const imageUrl = url?.qr;
//     const fileName = url?.title || "qr-code";

//     // Create an anchor element
//     const anchor = document.createElement("a");
//     anchor.href = imageUrl;
//     anchor.download = fileName;

//     // Append the anchor to the body
//     document.body.appendChild(anchor);

//     // Trigger the download by simulating a click event
//     anchor.click();

//     // Remove the anchor from the document
//     document.body.removeChild(anchor);
//   };

//   const navigate = useNavigate();
//   const { user } = UrlState();
//   const { id } = useParams();

//   const {
//     loading,
//     data: urlData,
//     fn,
//     error,
//   } = useFetch(getUrl, id);

//   const url = urlData?.[0];

//   const {
//     loading: loadingStats,
//     data: stats,
//     fn: fnStats,
//   } = useFetch(getClicksForUrl, id);

//   const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

//   useEffect(() => {
//     fn();
//   }, []);

//   useEffect(() => {
//     if (!error && loading === false && url) {
//       fnStats();
//     }
//   }, [loading, error, url]);

//   if (error) {
//     navigate("/dashboard");
//   }

//   let link = "";
//   if (url) {
//     link = url?.custom_url ? url?.custom_url : url.short_url;
//   }

//   return (
//     <>
//       {/* {(loading || loadingStats) && (
//         <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
//       )} */}

//       <div className="flex flex-col gap-4 sm:flex-row justify-between pl-10 pt-8">
//         <div className="flex flex-col items-start gap-2 rounded-lg sm:w-2/5">
//           <span className="text-4xl font-extrabold cursor-pointer pt-6">
//             {url?.title}
//           </span>
//           <a
//             href={`${link}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-3xl sm:text-4xl text-[#7f57f1] font-bold cursor-pointer"
//           >
//             {link}
//           </a>
//           <a
//             href={url?.original_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-1 hover:underline cursor-pointer pt-4"
//           >
//             {url?.original_url}
//           </a>
//           <span className="flex items-end font-extralight text-sm">
//             {url?.created_at && new Date(url.created_at).toLocaleString()}
//           </span>

//           <div className="flex gap-2">
//             <Button
//               className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
//               onClick={() =>
//                 navigator.clipboard.writeText(`${link}`)
//               }
//             >
//               <Copy />
//             </Button>

//             <Button
//               className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
//               variant="ghost"
//               onClick={downloadImage}
//             >
//               <Download />
//             </Button>

//             <Button
//               className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
//               onClick={() =>
//                 fnDelete().then(() => {
//                   navigate("/dashboard");
//                 })
//               }
//               disabled={loadingDelete}
//             >
//             <Trash />
//             </Button>
//           </div>

//           <img
//             src={url?.qr}
//             className="h-60 w-70 self-center sm:self-start ring ring-[#7f57f1] p-1 object-contain"
//             alt="qr code"
//           />
//         </div>
        
//         <Card className="sm:w-3/5 bg-white pb-20">
//           <CardHeader>
//             <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
//           </CardHeader>
//           {stats && stats.length ? (
//             <CardContent className="flex flex-col gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Total Clicks</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>{stats?.length}</p>
//                 </CardContent>
//               </Card>

//               <CardTitle>Location Data</CardTitle>
//               <Location stats={stats} />
//               <CardTitle>Device Info</CardTitle>
//               <DeviceStats stats={stats} />
//             </CardContent>
//           ) : (
//             <CardContent>
//               {loadingStats === false
//                 ? "No Statistics yet"
//                 : "Loading Statistics.."}
//             </CardContent>
//           )}
//         </Card>
//       </div>
//     </>
//   );
// };

// export default LinkPage;

import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const { loading, data: urlData, fn, error } = useFetch(getUrl, id);
  const url = urlData?.[0];

  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false && url) {
      fnStats();
    }
  }, [loading, error, url]);

  if (error) {
    navigate("/dashboard");
  }

  const link = url ? (url.custom_url ? url.custom_url : url.short_url) : "";

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

  return (
    <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-12 py-8">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row gap-8 justify-between items-center sm:items-start">
        {/* Left Side - URL Details */}
        <div className="flex flex-col items-center sm:items-start gap-4 w-full sm:w-2/5">
          <span className="text-3xl sm:text-4xl font-extrabold text-center sm:text-left">
            {url?.title}
          </span>

          {/* Shortened URL */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl sm:text-3xl lg:text-4xl text-[#7f57f1] font-bold break-all text-center sm:text-left hover:underline"
          >
            {link}
          </a>

          {/* Original URL */}
          <a
            href={url?.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base break-all text-center sm:text-left text-gray-600 hover:underline"
          >
            {url?.original_url}
          </a>

          {/* Date */}
          <span className="text-xs sm:text-sm text-gray-400">
            {url?.created_at && new Date(url.created_at).toLocaleString()}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
              onClick={() => navigator.clipboard.writeText(link)}
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
              variant="ghost"
              onClick={downloadImage}
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              className="bg-white hover:border-2 hover:border-gray-400 flex items-center justify-center"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disabled={loadingDelete}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          {/* QR Code */}
          <img
            src={url?.qr}
            className="h-48 w-48 sm:h-60 sm:w-60 mt-4 ring ring-[#7f57f1] p-2 object-contain rounded-md"
            alt="qr code"
          />
        </div>

        {/* Right Side - Stats */}
        <Card className="w-full sm:w-3/5 bg-white border-none">
          <CardHeader className='pt-0'>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold ">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{stats?.length}</p>
                </CardContent>
              </Card>

              <div>
                <CardTitle className='pb-6'>Location Data</CardTitle>
                <Location stats={stats} />
              </div>

              <div>
                <CardTitle>Device Info</CardTitle>
                <DeviceStats stats={stats} />
              </div>
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;
