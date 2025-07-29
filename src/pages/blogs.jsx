import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser, useSession } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/api/api-blogs";
import BlogCard from "@/components/Blogcard";

const BlogsListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoaded } = useUser();
  const { session } = useSession();

  const {
    data: blogs = [],
    isLoading: loadingBlogs,
  } = useQuery({
    queryKey: ["blogs", searchQuery],
    queryFn: async () => {
      const token = await session.getToken({ template: "supabase" });
      return getBlogs(token, { searchQuery });
    },
    enabled: isLoaded,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

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
            <h1 className="text-3xl font-bold mb-6 text-primary">Blogs</h1>

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
            </div>

            {loadingBlogs ? (
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
                {blogs.length ? (
                  blogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      savedInit={blog?.saved?.length > 0}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                    <p className="text-lg">No blogs found</p>
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

export default BlogsListing;