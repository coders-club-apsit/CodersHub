// --- NoteCard.jsx ---
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
import { deleteNote, saveNote } from "@/api/api-Notes";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/config/admin";

const NoteCard = ({ note, isMyNote = false, savedInit = false, onNoteSaved = () => {}, onNoteDeleted = () => {} }) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const { fn: fnSavedNotes, data: savedNotes, loading: loadingSavedNotes } = useFetch(saveNote, { alreadySaved: saved });
  const { fn: fnDeleteNote, loading: loadingDeleteNote } = useFetch(deleteNote);

  useEffect(() => {
    if (savedNotes !== undefined) setSaved(savedNotes?.length > 0);
  }, [savedNotes]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.includes(email));
    }
  }, [user]);

  const handleSaveNote = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking
    await fnSavedNotes({ user_id: user.id, note_id: note.id });
    onNoteSaved();
  };

  const handleDeleteNote = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.confirm("Are you sure you want to delete this note?")) {
        const response = await fnDeleteNote({ note_id: note.id });
        if (response) {
          onNoteDeleted();
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/note/edit/${note.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="space-y-6 w-full"
    >
      <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        {loadingDeleteNote && (
          <BarLoader className="mt-4 bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />
        )}
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="font-bold -lgtext-xl text-2xl">
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 line-clamp-2"
                  title={note.title} // Add tooltip on hover
                >
                  {note.title}
                </span>
              </CardTitle>
              <div className="flex items-center self-start shrink-0">
                {isMyNote && (
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 bg-red-500/5 hover:bg-red-500/10"
                        onClick={handleDeleteNote}
                        disabled={loadingDeleteNote}
                      >
                        <Trash2Icon 
                          className="h-4 w-4 text-red-500 hover:text-red-400 transition-colors" 
                        />
                      </Button>
                    </motion.div>
                    {loadingDeleteNote && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                        <BarLoader color="hsl(var(--primary))" width={20} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {note.last_edited_by && (
              <Badge
                variant="outline"
                className="text-xs font-normal text-muted-foreground/80 hover:text-muted-foreground transition-colors w-fit"
              >
                Last edited by: {note.last_edited_by}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:gap-6 flex-1 p-4 sm:p-6">
          {note.topic && (
            <motion.div
              className="relative group w-full"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0  rounded-lg -z-10 blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="flex items-center justify-center w-full">
                <img
                  src={note.topic.topic_logo_url}
                  alt="topic"
                  className="h-16 sm:h-20 object-contain rounded-lg transition-all duration-300 group-hover:brightness-110"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
          <div className="space-y-4">
            <hr className="border-blue-500/10" />
            <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
              {note.description.substring(0, note.description.indexOf(".") + 1)}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full gap-4">
            <Link to={`/note/${note.id}`} className="flex-1">
              <Button
                variant="secondary"
                className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
              >
                View Note
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
              {!isMyNote && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loadingSavedNotes}
                >
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-blue-500/5 hover:bg-blue-500/10"
                    onClick={handleSaveNote}
                    disabled={loadingSavedNotes}
                  >
                    <Bookmark
                      size={20}
                      className={cn(
                        "transition-all duration-300",
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NoteCard;