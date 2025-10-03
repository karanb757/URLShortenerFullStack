import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import { getUrls } from "@/db/apiUrls";
import { getClicksForUrl } from "@/db/apiClicks";
import { UrlState } from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);
  
  const [totalClicks, setTotalClicks] = useState(0);
  const [clicksLoading, setClicksLoading] = useState(false);

  useEffect(() => {
    fnUrls();
  }, []);

  // Calculate total clicks
  useEffect(() => {
    const fetchAllClicks = async () => {
      if (urls && urls.length > 0) {
        setClicksLoading(true);
        let total = 0;
        
        for (const url of urls) {
          const { data } = await getClicksForUrl(url.id);
          if (data) {
            total += data.length;
          }
        }
        
        setTotalClicks(total);
        setClicksLoading(false);
      }
    };

    fetchAllClicks();
  }, [urls]);

  const filteredUrls = Array.isArray(urls)
  ? urls.filter(u => u.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  : [];


  return (
    <div className="flex flex-col gap-8 py-6 px-8">
      {(loading || clicksLoading) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      
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
      
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>
      
      <div className="relative">
      <Input
      type="text"
      placeholder="Filter Links..."
      textColor="text-black"
      className="bg-white border-2 border-black"
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