import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bookmark, Trash2Icon, PenBox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { saveBlog, deleteBlog } from "@/api/api-blogs";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/config/admin";

const BlogCard = ({
  blog,
  isMyBlog = false,
  savedInit = false,
  onBlogSaved = () => {},
  onBlogDeleted = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    fn: fnSavedBlogs,
    data: savedBlogs,
    loading: loadingSavedBlogs,
  } = useFetch(saveBlog, { alreadySaved: saved });
  const { fn: fnDeleteBlogs, loading: loadingDeleteBlog } =
    useFetch(deleteBlog);

  useEffect(() => {
    if (savedBlogs !== undefined) setSaved(savedBlogs?.length > 0);
  }, [savedBlogs]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.includes(email));
    }
  }, [user]);

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    await fnSavedBlogs({ user_id: user.id, blog_id: blog.id });
    onBlogSaved();
  };

  const handleDeleteBlog = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this blog?")) {
        const response = await fnDeleteBlogs({ blog: blog.id });
        if (response) onBlogDeleted();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/blog/edit/${blog.id}`);
  };

  // Helper function to clean markdown tags and extract text
  const getCleanedContent = (content) => {
    if (!content) return "No content available";
    // Remove all markdown tags: images (e.g., ![alt](url)), links (e.g., [text](url)), bold (**text**), italic (*text*), etc.
    const cleaned = content
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images: ![alt](url)
      .replace(/\[.*?\]\(.*?\)/g, "") // Remove links: [text](url)
      .replace(/\*\*.*?(\*\*|$)/g, "") // Remove bold: **text**
      .replace(/\*.*?(\*|$)/g, "") // Remove italic: *text*
      .replace(/`.*?`/g, "") // Remove inline code: `code`
      .replace(/#+\s*/g, "") // Remove headers: #, ##, etc.
      .replace(/^\s*[-+*]\s+/gm, "") // Remove list markers: -, *, +
      .replace(/>/g, "") // Remove blockquotes: >
      .trim();
    // Split by period and take the first non-empty sentence, or return cleaned text if no period
    const sentences = cleaned.split(".").filter((s) => s.trim().length > 0);
    return sentences[0] || cleaned || "No content available";
  };

  // Extract only the date part from created_at (assuming format like "2025-06-09T03:01:00Z")
  const createdDate = blog.created_at ? blog.created_at.split("T")[0] : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="space-y-6 w-full"
    >
      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        {loadingDeleteBlog && (
          <BarLoader
            className="mt-4 bg-gradient-to-r from-blue-400 to-cyan-400"
            width="100%"
          />
        )}

        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-xl sm:text-2xl lg:text-3xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 line-clamp-2">
                    {blog.title}
                  </span>
                </CardTitle>
                <p className="text-muted-foreground text-base sm:text-md font-medium">
                  Created by - {blog.author_name?.split(".")[0]}
                </p>
                <p className="text-muted-foreground text-sm ">
                  Created on - {createdDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isMyBlog && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeleteBlog}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-400 transition-colors" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
            {blog.last_edited_by && (
              <Badge
                variant="outline"
                className="text-xs font-normal text-muted-foreground/80 hover:text-muted-foreground transition-colors w-fit"
              >
                Last edited by: {blog.last_edited_by}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:gap-6 flex-1 p-4 sm:p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
              {getCleanedContent(blog.content)}
            </p>
            <hr className="border-blue-500/10" />
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6">
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between w-full gap-4">
              <Link to={`/blog/${blog.id}`} className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                >
                  Read this Blog
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 bg-blue-500/5 hover:bg-blue-500/10"
                      onClick={handleEditClick}
                    >
                      <PenBox className="h-4 w-4 text-blue-500 hover:text-blue-400 transition-colors" />
                    </Button>
                  </motion.div>
                )}
                {!isMyBlog && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-blue-500/5 hover:bg-blue-500/10"
                      onClick={handleSaveBlog}
                      disabled={loadingSavedBlogs}
                    >
                      <Bookmark
                        size={20}
                        className={cn(
                          saved
                            ? "text-blue-500 fill-blue-500"
                            : "text-muted-foreground hover:text-blue-500"
                        )}
                      />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;