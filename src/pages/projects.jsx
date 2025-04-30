import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import projectData from "@/data/project.json";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollToTop from "@/components/ScrollToTop";

function ProjectDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    try {
      let projectsArray = Array.isArray(projectData)
        ? projectData
        : projectData?.projects || [];
      const foundProject = projectsArray.find((p) => p.id.toString() === id);
      if (!foundProject) {
        throw new Error("Project not found");
      }
      setProject(foundProject);
    } catch (err) {
      setError(err.message);
    }

    return () => clearTimeout(timer);
  }, [id]);

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
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col gap-4 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </motion.div>
    );
  }

  if (error || !project) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col md:flex-row">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-auto">
            <SideHeader searchQuery="" setSearchQuery={() => {}} />
            <motion.div
              className="flex-1 p-6 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center p-6 bg-background rounded-lg border">
                <h2 className="text-2xl font-bold text-destructive mb-4">
                  {error || "Project Not Found"}
                </h2>
                <motion.a
                  href="/projects"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  Back to Projects
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <SideHeader searchQuery="" setSearchQuery={() => {}} />
          <main className="flex-1 p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="mb-8" variants={itemVariants}>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
                  {project.category}
                </span>
                <h1 className="text-3xl font-bold text-primary mb-4">{project.title}</h1>
                <p className="text-muted-foreground mb-6">{project.description}</p>

                <motion.div
                  className="flex flex-wrap gap-2 mb-6"
                  variants={containerVariants}
                >
                  {project.tags?.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      variants={itemVariants}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  className="flex gap-4 mb-8"
                  variants={containerVariants}
                >
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-900 text-primary-foreground rounded-md hover:bg-gray-800"
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <motion.a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      Live Demo
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>

              <motion.section
                className="mb-12"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Project Walkthrough
                </h2>
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                >
                  {project.steps?.map((step, index) => (
                    <motion.div
                      key={index}
                      className="bg-background p-6 rounded-lg shadow-sm border"
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{step.content}</p>

                      {step.code && (
                        <div className="mb-4">
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                            <code className={`language-${step.code.language}`}>
                              {step.code.snippet}
                            </code>
                          </pre>
                        </div>
                      )}

                      {step.resources?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Resources:
                          </h4>
                          <motion.ul
                            className="space-y-1"
                            variants={containerVariants}
                          >
                            {step.resources.map((resource, idx) => (
                              <motion.li
                                key={idx}
                                variants={itemVariants}
                                whileHover="hover"
                              >
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {resource.label}
                                </a>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {project.references?.length > 0 && (
                <motion.section
                  className="mb-12"
                  variants={itemVariants}
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    References
                  </h2>
                  <motion.ul
                    className="space-y-2"
                    variants={containerVariants}
                  >
                    {project.references.map((ref, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        whileHover="hover"
                      >
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {ref.label}
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.section>
              )}

              <motion.div
                className="text-sm text-muted-foreground border-t pt-6 mt-8"
                variants={itemVariants}
              >
                Project created on{" "}
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </motion.div>
            </motion.div>
          </main>
        </div>
        <ScrollToTop />
      </div>
    </SidebarProvider>
  );
}

export default ProjectDetail;