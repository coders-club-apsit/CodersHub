import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams, Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getSingleResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowUpRightFromSquare } from "lucide-react";
import { LayoutPanelLeft } from "lucide-react";
import useReadingMode from "@/hooks/useReadingMode";

const ResourcesPage = () => {
  const { isLoaded } = useUser();
  const { id } = useParams();

  const {
    fn: fnResources,
    data: resources,
    loading: loadingResources,
  } = useFetch(getSingleResource, { resource_id: id });

  const { mode, toggleMode } = useReadingMode();

  useEffect(() => {
    if (isLoaded) fnResources();
  }, [isLoaded]);

  if (!isLoaded || loadingResources) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <Header />
      <div
        className={`mt-9 pt-16 ${
          mode === "compact"
            ? "px-4 md:px-8 lg:px-16 mx-auto max-w-4xl"
            : "px-6 md:px-12 w-full"
        }`}
      >
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

        <div className="flex justify-between items-center mb-4">
          <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl">
            {resources?.title}
          </h1>
          <motion.button
            onClick={toggleMode}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl shadow-md text-sm font-medium bg-background hover:bg-muted transition-all"
          >
            <motion.div
              animate={{ rotate: mode === "compact" ? 0 : 45 }}
              transition={{ duration: 0.3 }}
              className="transform origin-center"
            >
              <ArrowUpRightFromSquare className="w-4 h-4" />
            </motion.div>
            {mode === "compact" ? "Expand View" : "Compact View"}
          </motion.button>
        </div>

        <img
          src={resources?.topics?.topic_logo_url}
          className="h-12 mb-4"
          alt={resources?.title}
        />

        <h2 className="text-2xl sm:text-3xl font-bold mt-6">
          About this Resource
        </h2>
        <p className="sm:text-lg">{resources?.description}</p>

        <MDEditor.Markdown
          source={resources?.content}
          className="bg-transparent sm:text-lg mt-6"
        />
      </div>
    </>
  );
};

export default ResourcesPage;
