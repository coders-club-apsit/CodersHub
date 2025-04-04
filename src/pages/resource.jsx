import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getSingleResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import Header from "@/components/header";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ResourcesPage = () => {
  const { isLoaded } = useUser();
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
    <>
      <Header />
      <div className="flex flex-col gap-8 mt-9 m-6 pt-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </Link>
        </motion.div>

        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
          <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
            {resources?.title}
          </h1>
          <img
            src={resources?.topics?.topic_logo_url}
            className="h-12"
            alt={resources?.title}
          ></img>
        </div>
        <h2 className="text-2xl sm:text3xl font-bold">About this Resource</h2>
        <p className="sm:text-lg">{resources?.description}</p>
        <MDEditor.Markdown
          source={resources?.content}
          className="bg-transparent sm:text-lg"
        />
      </div>
    </>
  );
};

export default ResourcesPage;
