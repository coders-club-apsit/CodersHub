import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser, useSession } from "@clerk/clerk-react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTopics } from "@/api/api-topics";
import BlogCard from "./BlogCard";





function Blog(){

  

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const { isLoaded } = useUser();
  const { session } = useSession();

  const { data: topics = [] } = useQuery({    //here change this to Blog heading 
      queryKey: ["topics"],
      queryFn: async () => {
        const token = await session.getToken({ template: "supabase" });
        return getTopics(token);
      },
      enabled: isLoaded,
    });


  

    const {                                       //here change it to blogs
      data: Blog2 = [],
      isLoading: loadingNotes,
    } = useQuery({
      queryKey: ["Blog", searchQuery, selectedTopic],
      queryFn: async () => {
        const token = await session.getToken({ template: "supabase" });
        return getNotes(token, {
          searchQuery,
          topic_id: selectedTopic === "all" ? "" : selectedTopic,
        });
      },
      enabled: isLoaded,
    });

    const Blog1=[
      {
        id: 1,                            //ider se blog section me jayega
        title: "Blog 1",
        description: "This is Blog 1",
        topic: {
          name: "Blog 1",
          topic_logo_url: "https://qtclxwkkdzamvapvahac.supabase.co/storage/v1/object/public/topics-logo/logo-73502-Java"
        }
      },
      {
        id: 2,
        title: "Blog 2",
        description: "This is Blog 2",
        topic: {
          name: "Blog 2",
          topic_logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
        }
      },
      {
        id: 3,
        title: "Blog 3",
        description: "This is Blog 3",
        topic: {
          name: "Blog 3",
          topic_logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
        }
      }
    ];
  
    return <>
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
                  <SelectItem value="all">All Blogs</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loadingNotes ? (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {Blog1.length ? (
                  Blog1.map((note) => (
                    <BlogCard
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
    </>

}
export default Blog;