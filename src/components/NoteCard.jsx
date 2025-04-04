// eslint-disable react/prop-types
import { useUser } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, Trash2Icon, PenBox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteNote, saveNote } from "@/api/api-Notes";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { ADMIN_EMAILS } from "@/config/admin";

const NoteCard = ({
  note,
  isMyNote = false,
  savedInit = false,
  onNoteSaved = () => {},
  onNoteDeleted = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    fn: fnSavedNotes,
    data: savedNotes,
    loading: loadingSavedNotes,
  } = useFetch(saveNote, { alreadySaved: saved });

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
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this note?")) {
      const response = await fnDeleteNote({ note_id: note.id });
      if (response) onNoteDeleted();
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
      className="space-y-6 lg:max-w-[33.33%] max-w-2xl w-full lg:min-h-[410px]"
    >
      <Card className="flex flex-col h-full max-w-[350px]  transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        {loadingDeleteNote && (
          <BarLoader className="mt-4 w-full" color="hsl(var(--primary))" />
        )}
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <CardTitle className="font-bold text-lg sm:text-xl lg:text-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 line-clamp-2 sm:line-clamp-1">
                  {note.title}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={handleEditClick}
                    >
                      <PenBox className="h-4 w-4 text-blue-500 hover:text-blue-400 transition-colors" />
                    </Button>
                  </motion.button>
                )}
                {!isMyNote && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loadingSavedNotes}
                  >
                    <Button
                      variant="ghost"
                      className="w-8 h-8 p-0 hover:bg-blue-500/10"
                      onClick={handleSaveNote}
                      disabled={loadingSavedNotes}
                    >
                      <Heart
                        size={20}
                        className={cn(
                          "transition-all duration-300",
                          saved
                            ? "text-red-500 fill-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                      />
                    </Button>
                  </motion.button>
                )}
                {isMyNote && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={handleDeleteNote}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-400 transition-colors" />
                    </Button>
                  </motion.button>
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

        <CardFooter className="p-4 sm:p-6">
          <Link to={`/note/${note.id}`} className="w-full">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NoteCard;
