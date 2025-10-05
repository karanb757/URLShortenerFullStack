// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { QRCode } from "react-qrcode-logo";
// import { Copy, Download } from "lucide-react";
// import * as yup from "yup";
// import useFetch from "@/hooks/use-fetch";
// import { createUrl } from "@/db/apiUrls";
// import { UrlState } from "@/context";
// import Error from "@/components/error";

// const LandingPage = () => {
//   const [longUrl, setLongUrl] = useState("");
//   const [activeTab, setActiveTab] = useState("shorten");
//   const [showQRDialog, setShowQRDialog] = useState(false);
//   const [showSuccessDialog, setShowSuccessDialog] = useState(false);
//   const [generatedData, setGeneratedData] = useState(null);
//   const [errors, setErrors] = useState({});

//   const navigate = useNavigate();
//   const qrRef = useRef();
//   const { user, isAuthenticated } = UrlState();

//   // Schema for validation
//   const urlSchema = yup.object().shape({
//     longUrl: yup
//       .string()
//       .url("Must be a valid URL")
//       .required("URL is required"),
//   });

//   // Fetch hook for creating URL - Initialize with empty object
//   const {
//     loading,
//     error: apiError,
//     data,
//     fn: fnCreateUrl,
//   } = useFetch(createUrl);

//   // Handle successful URL creation
//   useEffect(() => {
//     if (apiError === null && data) {
//       console.log("URL created successfully:", data);
//       setGeneratedData(data[0]);
//       setShowSuccessDialog(true);
//       setLongUrl(""); // Clear input after success
//       toast.success("Link Generated Successfully!");
//     }
//   }, [apiError, data]);

//   const handleShortenClick = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       // Validate URL
//       await urlSchema.validate({ longUrl }, { abortEarly: false });

//       // Check if user is authenticated
//       if (!isAuthenticated) {
//         navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
//         return;
//       }

//       // Call backend API to create short URL
//       await fnCreateUrl({
//         title: `Link created on ${new Date().toLocaleDateString()}`,
//         longUrl: longUrl,
//         customUrl: "",
//         user_id: user?.id,
//       });

//     } catch (e) {
//       const newErrors = {};
//       e?.inner?.forEach((err) => {
//         newErrors[err.path] = err.message;
//       });
//       setErrors(newErrors);
//     }
//   };

//   const handleGenerateQR = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       await urlSchema.validate({ longUrl }, { abortEarly: false });
//       setShowQRDialog(true);
//       toast.success("QR Code Generated!");
//     } catch (e) {
//       const newErrors = {};
//       e?.inner?.forEach((err) => {
//         newErrors[err.path] = err.message;
//       });
//       setErrors(newErrors);
//     }
//   };

//   const handleCopyLink = () => {
//     const link = generatedData?.custom_url 
//       ? `${generatedData.custom_url}`
//       : `${generatedData?.short_url}`;

//       navigator.clipboard.writeText(link)
//       .then(() => {
//         toast("✅ Link copied to clipboard !"); // toast instead of alert
//       })
//       .catch(() => {
//         toast.error("❌ Failed to copy link .");
//       });
    
//   };

//   const handleDownloadQR = () => {
//     const canvas = qrRef.current?.canvasRef?.current;
//     if (canvas) {
//       const url = canvas.toDataURL();
//       const link = document.createElement("a");
//       link.download = "qr-code.png";
//       link.href = url;
//       link.click();
//     }
//   };

//   const shareToSocial = (platform) => {
//     const link = generatedData?.custom_url 
//       ? `${generatedData.custom_url}`
//       : `${generatedData?.short_url}`;
//     const url = encodeURIComponent(link);

//     const urls = {
//       whatsapp: `https://wa.me/?text=${url}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
//       twitter: `https://twitter.com/intent/tweet?url=${url}`,
//       email: `mailto:?subject=Check this link&body=${url}`,
//     };

//     if (urls[platform]) {
//       window.open(urls[platform], "_blank");
//     }
//   };

//   return (
//     <div className="relative flex flex-col items-center w-full mt-32 sm:mt-32 lg:mt-40 xl:mt-20">

//       <h2 className="my-10 text-4xl sm:text-4xl lg:text-7xl text-[#111828] text-center font-extrabold">
//         Got a boring long URL?
//         <br />
//         <span className="block mt-4 text-[#7F57F1]">Let&apos;s shrink it!</span>
//       </h2>
//       <div className="w-full md:w-2/4 mb-8 z-10">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <div className="flex justify-center mb-6">
//             <TabsList>
//               <TabsTrigger value="shorten" className='rounded-none'>Shorten URL</TabsTrigger>
//               <TabsTrigger value="qr" className='rounded-none'>Generate QR</TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="shorten">
//             <form
//               onSubmit={handleShortenClick}
//               className="sm:h-14 flex flex-col sm:flex-row gap-2"
//             >
//               <Input
//               type="url"
//               placeholder="Enter your long URL"
//               value={longUrl}
//               onChange={(e) => setLongUrl(e.target.value)}
//               className="h-14 sm:h-12 md:h-14 w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 bg-white border-black border-2 sm:border-3 md:border-4 text-xs sm:text-sm md:text-base"
//               />
//               <Button
//               type="submit"
//               className="h-full bg-[#7F57F1] text-white flex items-center justify-center gap-2"
//               variant="destructive"
//               disabled={loading}
//               >
//               {loading ? (
//                 <>
//                   <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 bg-[#7f57f1]" />
//                 </>
//               ) : (
//                 "Shorten"
//               )}
//             </Button>
 
//             </form>
//             {errors.longUrl && <Error message={errors.longUrl} />}
//             {apiError && <Error message={apiError.message || apiError} />}
//           </TabsContent>

//           <TabsContent value="qr">
//             <form
//               onSubmit={handleGenerateQR}
//               className="sm:h-14 flex flex-col sm:flex-row gap-2"
//             >
//               <input
//                 type="url"
//                 placeholder="Enter URL for QR code"
//                 value={longUrl}
//                 onChange={(e) => setLongUrl(e.target.value)}
//                 className="h-full flex-1 py-4 px-4 bg-white border-black border-4 !text-black placeholder:text-gray-400 rounded-lg outline-none focus:ring-0 focus:outline-none"
//               />
//               <Button
//                 type="submit"
//                 className="h-full bg-[#7F57F1]"
//                 variant="destructive"
//               >
//                 Generate
//               </Button>
//             </form>
//             {errors.longUrl && <Error message={errors.longUrl} />}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Success Dialog - Shows after URL is shortened */}
//       <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
//         <DialogContent className="sm:max-w-md bg-white !rounded-none">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">
//               Your link is ready! 🎉
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <p className="text-gray-600 text-sm pb-4">
//               Copy the link below or choose platform to share it.
//             </p>

//             <div className="p-4 bg-[#edf2ff] flex flex-col gap-8 rounded-none">
//               <span className="text-xl font-bold text-[#7f57f1] text-center bg-[#edf2ff] mt-4 cursor-pointer break-all">
//               {generatedData?.custom_url
//               ? `${generatedData.custom_url}`
//               : `${generatedData?.short_url}`}
//               </span>

//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => {
//                     setShowSuccessDialog(false);
//                     navigate('/dashboard');
//                   }}
//                   variant="outline"
//                   className="flex-1 bg-white border-2"
//                 >
//                   View link details
//                 </Button>
//                 <Button 
//                   onClick={handleCopyLink} 
//                   className="flex-1 bg-white border-2" 
//                   variant="outline"
//                 >
//                   <Copy size={16} className="mr-2 bg-transparent text-white" />
//                   Copy link
//                 </Button>
//               </div>
//             </div>

//             <div className="py-4">
//               <div className="flex gap-6 justify-center flex-wrap">
//                 <button
//                   onClick={() => shareToSocial("whatsapp")}
//                   className="flex flex-col items-center gap-1 hover:opacity-90 transition-opacity"
//                   type="button"
//                 >
//                   <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
//                     W
//                   </div>
//                   <span className="text-xs text-gray-600">WhatsApp</span>
//                 </button>
//                 <button
//                   onClick={() => shareToSocial("facebook")}
//                   className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
//                   type="button"
//                 >
//                   <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
//                     f
//                   </div>
//                   <span className="text-xs text-gray-600">Facebook</span>
//                 </button>
//                 <button
//                   onClick={() => shareToSocial("twitter")}
//                   className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
//                   type="button"
//                 >
//                   <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
//                     𝕏
//                   </div>
//                   <span className="text-xs text-gray-600">X</span>
//                 </button>
//                 <button
//                   onClick={() => shareToSocial("email")}
//                   className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
//                   type="button"
//                 >
//                   <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl">
//                     ✉
//                   </div>
//                   <span className="text-xs text-gray-600">Email</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* QR Code Dialog */}
//       <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
//         <DialogContent className="sm:max-w-md bg-white">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">
//               Your QR code is ready!
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <p className="text-gray-600 text-sm">
//               Scan this QR code to access your link or download it.
//             </p>

//             <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
//               <QRCode 
//                 ref={qrRef}
//                 value={longUrl || "https://example.com"} 
//                 size={200} 
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-600 text-center break-all">
//                 {longUrl}
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 onClick={handleDownloadQR}
//                 className="flex-1 bg-white border-2"
//               >
//                 <Download size={16} className="mr-2" />
//                 Download QR
//               </Button>
//               <Button
//                 onClick={() => setShowQRDialog(false)}
//                 className="flex-1 bg-white border-2"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default LandingPage;


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCode } from "react-qrcode-logo";
import { Copy, Download } from "lucide-react";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { UrlState } from "@/context";
import Error from "@/components/error";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [activeTab, setActiveTab] = useState("shorten");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const qrRef = useRef();
  const { user, isAuthenticated } = UrlState();

  // Schema for validation
  const urlSchema = yup.object().shape({
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("URL is required"),
  });

  // Fetch hook for creating URL
  const {
    loading,
    error: apiError,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl);

  // Handle successful URL creation
  useEffect(() => {
    if (apiError === null && data) {
      console.log("URL created successfully:", data);
      setGeneratedData(data[0]);
      setShowSuccessDialog(true);
      setLongUrl("");
      toast.success("Link Generated Successfully!");
    }
  }, [apiError, data]);

  const handleShortenClick = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await urlSchema.validate({ longUrl }, { abortEarly: false });

      if (!isAuthenticated) {
        navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
        return;
      }

      await fnCreateUrl({
        title: `Link created on ${new Date().toLocaleDateString()}`,
        longUrl: longUrl,
        customUrl: "",
        user_id: user?.id,
      });

    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await urlSchema.validate({ longUrl }, { abortEarly: false });
      setShowQRDialog(true);
      toast.success("QR Code Generated!");
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  // Get the proper redirect URL
  const getRedirectUrl = () => {
    if (!generatedData) return "";
    
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
    const shortCode = generatedData?.custom_url || generatedData?.short_url?.split('/').pop();
    
    return `${APP_URL}/${shortCode}`;
  };

  // Get display URL (what user sees)
  const getDisplayUrl = () => {
    if (!generatedData) return "";
    return generatedData?.custom_url ? generatedData.custom_url : generatedData?.short_url;
  };

  const handleCopyLink = () => {
    const link = getRedirectUrl();
    
    navigator.clipboard.writeText(link)
      .then(() => {
        toast("✅ Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("❌ Failed to copy link.");
      });
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.canvasRef?.current;
    if (canvas) {
      const url = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = url;
      link.click();
    }
  };

  const shareToSocial = (platform) => {
    const link = getRedirectUrl();
    const url = encodeURIComponent(link);

    const urls = {
      whatsapp: `https://wa.me/?text=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}`,
      email: `mailto:?subject=Check this link&body=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full mt-32 sm:mt-32 lg:mt-40 xl:mt-20">

      <h2 className="my-10 text-4xl sm:text-4xl lg:text-7xl text-[#111828] text-center font-extrabold">
        Got a boring long URL?
        <br />
        <span className="block mt-4 text-[#7F57F1]">Let&apos;s shrink it!</span>
      </h2>
      
      <div className="w-full md:w-2/4 mb-8 z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="shorten" className='rounded-none'>Shorten URL</TabsTrigger>
              <TabsTrigger value="qr" className='rounded-none'>Generate QR</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shorten">
            <form
              onSubmit={handleShortenClick}
              className="sm:h-14 flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="url"
                placeholder="Enter your long URL"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-14 sm:h-12 md:h-14 w-full py-2 sm:py-3 md:py-4 px-3 sm:px-4 bg-white border-black border-2 sm:border-3 md:border-4 text-xs sm:text-sm md:text-base"
              />
              <Button
                type="submit"
                className="h-full bg-[#7F57F1] text-white flex items-center justify-center gap-2"
                variant="destructive"
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 bg-[#7f57f1]" />
                ) : (
                  "Shorten"
                )}
              </Button>
            </form>
            {errors.longUrl && <Error message={errors.longUrl} />}
            {apiError && <Error message={apiError.message || apiError} />}
          </TabsContent>

          <TabsContent value="qr">
            <form
              onSubmit={handleGenerateQR}
              className="sm:h-14 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="url"
                placeholder="Enter URL for QR code"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-full flex-1 py-4 px-4 bg-white border-black border-4 !text-black placeholder:text-gray-400 rounded-lg outline-none focus:ring-0 focus:outline-none"
              />
              <Button
                type="submit"
                className="h-full bg-[#7F57F1]"
                variant="destructive"
              >
                Generate
              </Button>
            </form>
            {errors.longUrl && <Error message={errors.longUrl} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Dialog - Shows after URL is shortened */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white !rounded-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Your link is ready! 🎉
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm pb-4">
              Copy the link below or choose platform to share it.
            </p>

            <div className="p-4 bg-[#edf2ff] flex flex-col gap-8 rounded-none">
              {/* FIXED: Made the URL clickable with proper anchor tag */}
              <a
                href={getRedirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-[#7f57f1] text-center bg-[#edf2ff] mt-4 cursor-pointer break-all hover:underline transition-all"
              >
                {getDisplayUrl()}
              </a>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowSuccessDialog(false);
                    navigate('/dashboard');
                  }}
                  variant="outline"
                  className="flex-1 bg-white border-2"
                >
                  View link details
                </Button>
                <Button 
                  onClick={handleCopyLink} 
                  className="flex-1 bg-white border-2" 
                  variant="outline"
                >
                  <Copy size={16} className="mr-2 bg-transparent text-white" />
                  Copy link
                </Button>
              </div>
            </div>

            <div className="py-4">
              <div className="flex gap-6 justify-center flex-wrap">
                <button
                  onClick={() => shareToSocial("whatsapp")}
                  className="flex flex-col items-center gap-1 hover:opacity-90 transition-opacity"
                  type="button"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    W
                  </div>
                  <span className="text-xs text-gray-600">WhatsApp</span>
                </button>
                <button
                  onClick={() => shareToSocial("facebook")}
                  className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                  type="button"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    f
                  </div>
                  <span className="text-xs text-gray-600">Facebook</span>
                </button>
                <button
                  onClick={() => shareToSocial("twitter")}
                  className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                  type="button"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                    𝕏
                  </div>
                  <span className="text-xs text-gray-600">X</span>
                </button>
                <button
                  onClick={() => shareToSocial("email")}
                  className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                  type="button"
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl">
                    ✉
                  </div>
                  <span className="text-xs text-gray-600">Email</span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Your QR code is ready!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Scan this QR code to access your link or download it.
            </p>

            <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
              <QRCode 
                ref={qrRef}
                value={longUrl || "https://example.com"} 
                size={200} 
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 text-center break-all">
                {longUrl}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownloadQR}
                className="flex-1 bg-white border-2"
              >
                <Download size={16} className="mr-2" />
                Download QR
              </Button>
              <Button
                onClick={() => setShowQRDialog(false)}
                className="flex-1 bg-white border-2"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;