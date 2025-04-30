import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/project.json";
import "@/index.css";

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading data
    setProjects(projectsData);
    setLoading(false);
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </motion.div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex bg-background text-foreground w-full relative">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <SideHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <main className="flex-1 p-6 relative mt-16">
            <motion.div
              className="max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-3xl font-bold text-primary mb-8"
                variants={itemVariants}
              >
                Projects
              </motion.h1>
              {filteredProjects.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                >
                  {filteredProjects.map((project) => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  className="text-muted-foreground text-center"
                  variants={itemVariants}
                >
                  No projects found matching your search.
                </motion.p>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ProjectsList;