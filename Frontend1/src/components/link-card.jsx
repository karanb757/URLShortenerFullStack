import { Copy, Download, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";

const LinkCard = ({ url = {}, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "qr-code";

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  // Determine the display URL
  const displayUrl = url?.custom_url 
    ? `${url.custom_url}` 
    : `${url.short_url}`;

  const copyUrl = url?.custom_url || url?.short_url;

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 rounded-lg">
      <img
        src={url?.qr}
        className="h-24 w-24 object-contain ring ring-[#7f57f1] self-start mt-2"
        alt="qr code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <div className="flex flex-col ">
          <span className="text-3xl font-extrabold cursor-pointer">
            {url?.title}
          </span>
          <span className="text-2xl text-[#7f57f1] font-bold hover:underline cursor-pointer">
            {displayUrl}
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            {url?.original_url}
          </span>

          <span className="flex items-end font-extralight text-sm flex-1">
            {new Date(url?.created_at).toLocaleString()}
          </span>
        </div>
      </Link>
      <div className="flex gap-2">
        <button
          className="bg-white hover:bg-white"
          onClick={() =>
            navigator.clipboard.writeText(`${copyUrl}`)
          }
        >
          <Copy />
        </button>

        <button onClick={downloadImage}>
          <Download />
        </button>

        <button
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
        >
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;