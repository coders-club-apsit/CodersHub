import React, { useState, useEffect } from "react";
import NoteCard from "@/components/NoteCard";
import useFetch from "@/hooks/use-fetch";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { Search } from "lucide-react";
import { getTopics } from "@/api/api-topics";
import { Input } from "@/components/ui/input";
import { getNotes } from "@/api/api-Notes";
import { useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Preloader from "@/components/Preloader";

const NotesListing = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoaded } = useUser();
  const [selectedTopic, setSelectedTopic] = useState("all");

  const {
    fn: fnNotes,
    data: notes,
    loading: loadingNotes,
  } = useFetch(getNotes, { 
    searchQuery, 
    topic_id: selectedTopic === "all" ? "" : selectedTopic 
  });

  const { fn: fnTopics, data: topics } = useFetch(getTopics);

  useEffect(() => {
    if (isLoaded) fnTopics();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnNotes();
  }, [isLoaded, searchQuery, selectedTopic]);

  // Add preloader delay effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Show preloader during initial load
  if (!isLoaded || showPreloader) {
    return <Preloader />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  const skeletonCount = notes?.length || 4; // Show at least 4 skeletons if notes are unknown

  return (
    <SidebarProvider>
      <div className="flex bg-background text-foreground w-full relative">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <SideHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <main className="flex-1 p-6 relative">
            <h1 className="text-3xl font-bold mb-6 text-primary">Notes</h1>
            
            {/* Search and Filter Controls */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full pr-20 bg-background text-foreground rounded-md"
                />
              </div>
              
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-[35%] sm:w-[200px] bg-background text-foreground rounded-md">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loading Skeletons */}
            {loadingNotes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-4 w-[60%]" />
                      <Skeleton className="h-4 w-[40%]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes Grid */}
            {!loadingNotes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {notes?.length ? (
                  notes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      savedInit={note?.saved?.length > 0}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                    <p className="text-lg">No notes found</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NotesListing;
