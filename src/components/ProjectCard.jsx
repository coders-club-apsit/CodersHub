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

const ProjectCard = ({ project, isMyProject = false, savedInit = false, onProjectSaved = () => {}, onProjectDeleted = () => {} }) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const { fn: fnSavedProjects, data: savedProjects, loading: loadingSavedProjects } = useFetch(saveProject, { alreadySaved: saved });
  const { fn: fnDeleteProjects, loading: loadingDeleteProject } = useFetch(deleteProject);

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
      if (window.confirm("Are you sure you want to delete this note?")) {
        const response = await fnDeleteProjects({ project_id: project.id });
        if (response) onProjectDeleted();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
      whileHover={{ y: -5 }} 
      className="space-y-6 w-full"
    >
      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        {loadingDeleteProject && <BarLoader className="mt-4 bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />}
        
        {/* Image Section */}
        {project.topic && (
          <motion.div 
            className="relative group w-full h-48 sm:h-56 md:h-64" 
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 rounded-t-lg -z-10 blur-xl group-hover:blur-2xl transition-all duration-300" />
            <img 
              src={project.topic.topic_logo_url} 
              alt="topic" 
              className="w-full h-full object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-110" 
              loading="lazy" 
            />
          </motion.div>
        )}

        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="font-bold text-lg sm:text-xl lg:text-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 line-clamp-2">
                  {project.title}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {isMyProject && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" onClick={handleDeleteProject}>
                      <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-400 transition-colors" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
            {/* {project.last_edited_by && (
              <Badge 
                variant="outline" 
                className="text-xs font-normal text-muted-foreground/80 hover:text-muted-foreground transition-colors w-fit"
              >
                Last edited by: {project.last_edited_by}
              </Badge>
            )} */}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:gap-6 flex-1 sm:p-6">
          <div className="space-y-4">
            <hr className="border-blue-500/10" />
            <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
              {project.description?.split(".")[0]}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6">
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between w-full gap-4">
              <Link to={`/project/${project.id}`} className="flex-1">
                <Button 
                  variant="secondary" 
                  className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                >
                  View project
                  <motion.span className="ml-2" initial={{ x: 0 }} whileHover={{ x: 3 }}>→</motion.span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
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
                {!isMyProject && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 bg-blue-500/5 hover:bg-blue-500/10" 
                      onClick={handleSaveProject} 
                      disabled={loadingSavedProjects}
                    >
                      <Bookmark 
                        size={20} 
                        className={cn(saved ? "text-blue-500 fill-blue-500" : "text-muted-foreground hover:text-blue-500")} 
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

export default ProjectCard;