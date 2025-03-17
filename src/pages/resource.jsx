import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getSingleResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import Header from "@/components/header";

const ResourcesPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn: fnResources,
    data: resources,
    loading: loadingResources,
  } = useFetch(getSingleResource, { resource_id: id });

  useEffect(() => {
    if (isLoaded) fnResources();
  }, [isLoaded]);

  if (!isLoaded || loadingResources) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div data-color-mode="dark" className="text-white min-h-screen p-6">
      <Header />
      <div className="flex flex-col gap-8 mt-9">
        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
          <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl text-white">
            {resources?.title}
          </h1>
          <img
            src={resources?.topics?.topic_logo_url}
            className="h-12"
            alt={resources?.title}
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          About this Resource
        </h2>
        <p className="sm:text-lg text-gray-300">{resources?.description}</p>
        <div data-color-mode="dark" className="markdown-dark">
          <MDEditor.Markdown
            source={resources?.content}
            className="bg-transparent text-white sm:text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
