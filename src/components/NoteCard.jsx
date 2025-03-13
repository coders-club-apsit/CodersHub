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

  const ADMIN_EMAILS = [
    "yadnesh2105@gmail.com",
    "cyption.one@gmail.com",
    "abhishekmt2004@gmail.com",
    "avanishvadke001@gmail.com",
    "atharvashelke2303@gmail.com",
    "vedantshinde2066@gmail.com",
    "dasparth1544@gmail.com",
    "aarya.bivalkar1605@gmail.com",
    "gaikwadnayan2004@gmail.com",
    "abdulkhan13114@gmail.com",
    "moresarakshi@gmail.com",
    "nikhilbhosale7960@gmail.com",
    "zahidhamdule12@gmail.com",
    "durva.waghchaure1102@gmail.com",
    "oveedolkar@gmail.com",
    "nishilrathod2512@gmail.com",
  ];

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
    <Link to={`/note/${note.id}`} className="block">
      <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
        {loadingDeleteNote && (
          <BarLoader className="mb-8" width={"100%"} color="#36d7b9" />
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-bold">
            <span>{note.title}</span>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={handleEditClick}
                >
                  <PenBox className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                </Button>
              )}
              {!isMyNote && (
                <Button
                  variant="ghost"
                  className="w-5"
                  onClick={handleSaveNote}
                  disabled={loadingSavedNotes}
                >
                  {saved ? (
                    <Heart size={20} stroke="red" fill="red" />
                  ) : (
                    <Heart size={20} />
                  )}
                </Button>
              )}
              {isMyNote && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={handleDeleteNote}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-600" />
                </Button>
              )}
            </div>
          </CardTitle>
          {note.last_edited_by && (
            <div className="text-sm text-gray-500">
              Last edited by: {note.last_edited_by}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          {note.topic && (
            <img
              src={note.topic.topic_logo_url}
              alt="topic"
              className="h-[20vmin] w-[20vmin] object-contain mx-auto"
            />
          )}
          <hr />
          {note.description.substring(0, note.description.indexOf(".") + 1)}
        </CardContent>
        <CardFooter className="flex gap-2"></CardFooter>
      </Card>
    </Link>
  );
};

export default NoteCard;
