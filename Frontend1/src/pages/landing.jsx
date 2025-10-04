import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { BeatLoader } from "react-spinners";
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

  // Fetch hook for creating URL - Initialize with empty object
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
      setLongUrl(""); // Clear input after success
    }
  }, [apiError, data]);

  const handleShortenClick = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate URL
      await urlSchema.validate({ longUrl }, { abortEarly: false });

      // Check if user is authenticated
      if (!isAuthenticated) {
        navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
        return;
      }

      // Call backend API to create short URL
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
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleCopyLink = () => {
    const link = generatedData?.custom_url 
      ? `${generatedData.custom_url}`
      : `${generatedData?.short_url}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
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
    const link = generatedData?.custom_url 
      ? `${generatedData.custom_url}`
      : `${generatedData?.short_url}`;
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
    <div className="relative flex flex-col items-center w-full">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-[#111828] text-center font-extrabold">
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
                className="h-full flex-1 py-4 px-4 bg-white border-black border-4"
              />
              <Button
                type="submit"
                className="h-full bg-[#7F57F1]"
                variant="destructive"
                disabled={loading}
              >
                {loading ? <BeatLoader size={8} color="white" /> : "Shorten"}
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
              {/* <Input 
                  type="url" 
                  placeholder="Enter URL for QR code" 
                  value={longUrl} onChange={(e) => setLongUrl(e.target.value)} 
                  className="h-full flex-1 py-4 px-4 bg-white border-black border-4 text-black" /> 
              */}

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
              <span className="text-xl font-bold text-[#7f57f1] text-center bg-[#edf2ff] mt-4 cursor-pointer break-all">
                {generatedData?.custom_url
                  ? `${generatedData.custom_url}`
                  : `${generatedData?.short_url?.replace('http://localhost:3000/', '')}`}
              </span>

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