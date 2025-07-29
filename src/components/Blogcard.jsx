
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bookmark, Trash2Icon, PenBox, Calendar, User } from "lucide-react";
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
  
  const { 
    fn: fnDeleteBlogs, 
    loading: loadingDeleteBlog 
  } = useFetch(deleteBlog);

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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full"
    >
      <Card className="group relative flex flex-col h-full overflow-hidden border border-blue-500/20 bg-transparent backdrop-blur-sm transition-all duration-500 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20">
        
        {/* Loading indicator */}
        {loadingDeleteBlog && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <BarLoader 
              className="bg-gradient-to-r from-blue-400 to-cyan-400" 
              width="100%" 
              height={3}
            />
          </div>
        )}

        {/* Card Header */}
        <CardHeader className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <CardTitle className="text-xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent line-clamp-2 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                  {blog.title}
                </span>
              </CardTitle>
              
              {/* Author and Date Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {blog.author_name?.split(".")[0] || "Unknown Author"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{createdDate}</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              {isAdmin && (
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                    onClick={handleEditClick}
                  >
                    <PenBox className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {isMyBlog && (
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                    onClick={handleDeleteBlog}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Last edited badge */}
          {blog.last_edited_by && (
            <div className="pt-3">
              <Badge
                variant="outline"
                className="text-xs font-medium bg-blue-50/50 text-blue-700 border-blue-200/50 hover:bg-blue-100/50 transition-colors duration-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50"
              >
                Last edited by: {blog.last_edited_by}
              </Badge>
            </div>
          )}
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex-1 px-6 py-0 space-y-4">
          <div className="space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-800" />
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4">
              {getCleanedContent(blog.content)}
            </p>
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex-shrink-0 p-6 pt-4">
          <div className="flex items-center justify-between w-full gap-3">
            {/* Read Blog Button */}
            <Link to={`/blog/${blog.id}`} className="flex-1">
              <Button
              variant="secondary" 
                className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                size="default"
              >
                <span>Read this Blog</span>
                <motion.span 
                  className="ml-2 text-lg"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </Button>
            </Link>
            
            {/* Save/Bookmark Button */}
            {!isMyBlog && (
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="default"
                  className={cn(
                    "h-10 w-10 p-0 border-2 transition-all duration-300 bg-transparent",
                    saved 
                      ? "border-blue-500 hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-950/30" 
                      : "border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
                  )}
                  onClick={handleSaveBlog} 
                  disabled={loadingSavedBlogs}
                >
                  <Bookmark 
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      saved ? "fill-current" : ""
                    )} 
                  />
                </Button>
              </motion.div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
