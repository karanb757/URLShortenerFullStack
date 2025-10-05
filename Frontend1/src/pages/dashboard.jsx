import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import { getUrls } from "@/db/apiUrls";
import { UrlState } from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);

  useEffect(() => {
    fnUrls();
  }, []);

  // Calculate total clicks from the URLs data
  const totalClicks = Array.isArray(urls) 
    ? urls.reduce((sum, url) => sum + (url.clicks || 0), 0)
    : 0;

  const filteredUrls = Array.isArray(urls)
    ? urls.filter(u => u.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col gap-8 py-6 px-8">
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
      
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl font-extrabold">
            Links Created: {urls?.length || 0}
          </h1>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">
            Total Clicks: {totalClicks}
          </h1>
        </div>
      </div>
      
      <div>
        <h1 className="text-4xl font-extrabold">My Links</h1>
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border-2 border-black text-black"
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      
      {error && <Error message={error} />}
      
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;