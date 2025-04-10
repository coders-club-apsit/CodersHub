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
import { deleteResource, saveResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/config/admin";

const ResourcesCard = ({ resource, isMyResource = false, savedInit = false, onResourceSaved = () => {}, onResourceDeleted = () => {} }) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const { fn: fnSavedResources, data: savedResources, loading: loadingSavedResources } = useFetch(saveResource, { alreadySaved: saved });
  const { fn: fnDeleteResource, loading: loadingDeleteResource } = useFetch(deleteResource);

  const handleSaveResource = async () => {
    await fnSavedResources({ user_id: user.id, resource_id: resource.id });
    onResourceSaved();
  };

  const handleDeleteResource = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      const response = await fnDeleteResource({ resource_id: resource.id });
      if (response) onResourceDeleted();
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/resource/edit/${resource.id}`);
  };

  useEffect(() => {
    if (savedResources !== undefined) setSaved(savedResources?.length > 0);
  }, [savedResources]);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="space-y-6 w-full">
      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        {loadingDeleteResource && <BarLoader className="mt-4 w-full" color="hsl(var(--primary))" />}
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <CardTitle className="font-bold text-lg sm:text-xl lg:text-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 line-clamp-2 sm:line-clamp-1">
                  {resource.title}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
                {isMyResource && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" onClick={handleDeleteResource}>
                      <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-400 transition-colors" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
            {resource.last_edited_by && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground/80 hover:text-muted-foreground transition-colors w-fit">
                Last edited by: {resource.last_edited_by}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:gap-6 flex-1 p-4 sm:p-6 min-h-0">
          {resource.topic && (
            <motion.div className="relative group w-full flex-shrink-0" whileHover={{ scale: 1.02 }}>
              <div className="absolute inset-0 rounded-lg -z-10 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="flex items-center justify-center w-full">
                <img src={resource.topic.topic_logo_url} alt="topic" className="h-16 sm:h-20 object-contain rounded-lg transition-all duration-300 group-hover:brightness-110" loading="lazy" />
              </div>
            </motion.div>
          )}
          <div className="space-y-4 flex-1 min-h-0">
            <hr className="border-blue-500/10" />
            <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
              {resource.description?.split(".")[0]}.
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between w-full gap-4">
            <Link to={`/resource/${resource.id}`} className="flex-1">
              <Button variant="secondary" className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 text-sm sm:text-base">
                View More
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

              {!isMyResource && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="h-8 w-8 p-0 bg-blue-500/5 hover:bg-blue-500/10" onClick={handleSaveResource} disabled={loadingSavedResources}>
                    <Bookmark size={20} className={cn(saved ? "text-blue-500 fill-blue-500" : "text-muted-foreground hover:text-blue-500")} />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ResourcesCard;