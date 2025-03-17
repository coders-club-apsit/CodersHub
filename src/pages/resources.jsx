import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { Search } from "lucide-react";
import { getTopics } from "@/api/api-topics";
import { Input } from "@/components/ui/input";
import { getResources } from "@/api/api-resources";
import { useUser } from "@clerk/clerk-react";
import ResourcesCard from "@/components/ResourcesCard";
import { Skeleton } from "@/components/ui/skeleton";


const ResourcesListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoaded } = useUser();
  const [topic_id, setTopic_id] = useState("");

  const {
    fn: fnResources,
    data: resources,
    loading: loadingResources,
  } = useFetch(getResources, { searchQuery, topic_id });

  const { fn: fnTopics, data: topics } = useFetch(getTopics);

  useEffect(() => {
    if (isLoaded) fnTopics();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnResources();
  }, [isLoaded, searchQuery, topic_id]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Simple fallback while user data loads
  }

  return (
    <SidebarProvider>
      <div className="flex bg-background text-foreground overflow-hidden w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <SideHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">Resources</h1>
            <div className="relative mb-6 flex justify-end">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full pr-20 bg-background text-foreground rounded-md"
              />
            </div>
            {loadingResources && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] w-[290px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
              {!loadingResources && resources?.length ? (
                resources.map((resource) => (
                  <ResourcesCard
                    key={resource.id}
                    resource={resource}
                    savedInit={resource?.saved?.length > 0}
                  />
                ))
              ) : (
                <div className="col-span-full text-center items-center text-muted-foreground"></div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResourcesListing;
