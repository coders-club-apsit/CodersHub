import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getSingleNote } from "@/api/api-Notes";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import Header from "@/components/header";

const NotePage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn: fnNotes,
    data: notes,
    loading: loadingNotes,
  } = useFetch(getSingleNote, { note_id: id });

  useEffect(() => {
    if (isLoaded) fnNotes();
  }, [isLoaded]);

  if (!isLoaded || loadingNotes) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col gap-8 mt-9 m-6">
        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
          <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
            {notes?.title}
          </h1>
          <img
            src={notes?.topics?.topic_logo_url}
            className="h-12"
            alt={notes?.title}
          ></img>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">About this Note</h2>
        <p className="sm:text-lg">{notes?.description}</p>
        <div data-color-mode="dark"> // made this dark
          <MDEditor.Markdown
            source={notes?.content}
            className="text-white sm:text-lg"
          />
        </div>
      </div>
    </>
  );
};

export default NotePage;
