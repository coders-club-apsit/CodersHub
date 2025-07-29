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
import { saveProject, deleteProject } from "@/api/api-projects";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/config/admin";

const ProjectCard = ({ 
  project, 
  isMyProject = false, 
  savedInit = false, 
  onProjectSaved = () => {}, 
  onProjectDeleted = () => {} 
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const { 
    fn: fnSavedProjects, 
    data: savedProjects, 
    loading: loadingSavedProjects 
  } = useFetch(saveProject, { alreadySaved: saved });
  
  const { 
    fn: fnDeleteProjects, 
    loading: loadingDeleteProject 
  } = useFetch(deleteProject);

  // Dummy tags for demonstration
  const dummyTags = ["Model", "Regression", "Python"];
  const projectTags = project.tags && project.tags.length > 0 
    ? [...project.tags, ...dummyTags]
    : dummyTags;

  useEffect(() => {
    if (savedProjects !== undefined) setSaved(savedProjects?.length > 0);
  }, [savedProjects]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.includes(email));
    }
  }, [user]);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    await fnSavedProjects({ user_id: user.id, project_id: project.id });
    onProjectSaved();
  };

  const handleDeleteProject = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this project?")) {
        const response = await fnDeleteProjects({ project_id: project.id });
        if (response) onProjectDeleted();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/project/edit/${project.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      whileHover={{ y: -8 }} 
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full"
    >
      <Card className="group relative flex flex-col h-full overflow-hidden border border-blue-500/20 ">
        
        {/* Loading indicator */}
        {loadingDeleteProject && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <BarLoader 
              className="bg-gradient-to-r from-blue-400 to-cyan-400" 
              width="100%" 
              height={3}
            />
          </div>
        )}
        
        {/* Project Image */}
        {project.topic && (
          <div className="relative w-full h-48 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              src={project.topic.topic_logo_url} 
              alt={`${project.title} topic`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
            />
          </div>
        )}

        {/* Card Header */}
        <CardHeader className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="flex-1 text-xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent line-clamp-2 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                {project.title}
              </span>
            </CardTitle>
            
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
              
              {isMyProject && (
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                    onClick={handleDeleteProject}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex-1 px-6 py-0 space-y-4">
          {/* Description */}
          <div className="space-y-3">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
              {project.description ? `${project.description.split(".")[0]}.` : "No description available."}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {projectTags.slice(0, 4).map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="text-xs font-medium bg-blue-50/80 text-blue-700 hover:bg-blue-100/80 border border-blue-200/50 transition-colors duration-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50"
              >
                {tag}
              </Badge>
            ))}
            {projectTags.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs font-medium text-slate-500 border-slate-300 dark:text-slate-400 dark:border-slate-600"
              >
                +{projectTags.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex-shrink-0 p-6 pt-4">
          <div className="flex items-center justify-between w-full gap-3">
            {/* View Project Button */}
            <Link to={`/project/${project.id}`} className="flex-1">
              <Button
              variant="secondary" 
                className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all  text-sm sm:text-base text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                size="default"
              >
                <span>View Project</span>
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
            {!isMyProject && (
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="default"
                  className={cn(
                    "h-10 w-10 p-0 border-2 transition-all duration-300",
                    saved 
                      ? "border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:hover:bg-blue-900/50" 
                      : "border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
                  )}
                  onClick={handleSaveProject} 
                  disabled={loadingSavedProjects}
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

export default ProjectCard;