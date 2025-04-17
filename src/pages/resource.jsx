import { useUser, useSession } from "@clerk/clerk-react";
import { useParams, Link } from "react-router-dom";
import { getSingleResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import Header from "@/components/header";
import { ArrowLeft, Expand, PanelLeftClose, PenBox, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { isAndroid } from "react-device-detect";
import { useQuery } from "@tanstack/react-query";
import useReadingMode from "@/hooks/useReadingMode";
import ScrollToTop from '@/components/ScrollToTop';
import { ADMIN_EMAILS } from "@/config/admin";
import { useState, useEffect, useMemo } from "react";

const extractIndex = (content) => {
  if (!content) return [];
  // Extract level 2 headings (## Heading)
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const label = match[1].trim();
    const href =
      "#" +
      label
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    matches.push({ label, href });
  }
  return matches;
};

const ResourcesPage = () => {
  const { isLoaded, user } = useUser();
  const { session } = useSession();
  const { id } = useParams();
  const { mode, toggleMode } = useReadingMode();
  const [isAdmin, setIsAdmin] = useState(false);
  const [indexCollapsed, setIndexCollapsed] = useState(false);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const { data: resources, isLoading: loadingResources } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const token = await session.getToken({ template: "supabase" });
      return getSingleResource(token, { resource_id: id });
    },
    enabled: isLoaded,
  });

  const resourceIndex = useMemo(() => extractIndex(resources?.content), [resources?.content]);

  if (!isLoaded || loadingResources) {
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-background to-background/50 flex">
        {/* Sidebar Index */}
        {resourceIndex.length > 0 && (
          <aside
            className={`
              hidden lg:flex flex-col sticky top-24 self-start transition-all duration-300 z-20
              ${indexCollapsed ? "w-0 min-w-0 mr-0" : "w-72 min-w-[16rem] mr-8"}
            `}
          >
            <div
              className={`
                bg-card rounded-xl shadow border border-primary/10 h-full flex flex-col transition-all duration-300 relative
                ${indexCollapsed ? "p-0" : "p-4"}
              `}
            >
              {/* Toggle button always visible */}
              <button
                className={`
                  absolute top-6 -right-5 z-30
                  bg-background border border-primary/20 shadow-lg
                  rounded-full p-2 flex items-center justify-center
                  transition-all duration-200
                  hover:bg-primary/10 hover:border-primary/40
                  ${indexCollapsed ? "scale-110" : ""}
                `}
                style={{
                  width: 40,
                  height: 40,
                  boxShadow: "0 4px 16px 0 rgba(31,38,135,0.10)",
                  right: indexCollapsed ? '-20px' : '-20px',
                  cursor: "pointer"
                }}
                onClick={() => setIndexCollapsed((c) => !c)}
                title={indexCollapsed ? "Expand Index" : "Collapse Index"}
                aria-label={indexCollapsed ? "Expand Index" : "Collapse Index"}
              >
                {indexCollapsed ? (
                  <ChevronRight size={22} className="text-primary" />
                ) : (
                  <ChevronLeft size={22} className="text-primary" />
                )}
              </button>
              {!indexCollapsed && (
                <div className="mt-2">
                  <h2 className="text-lg font-semibold mb-3 text-primary">Index</h2>
                  <ul className="space-y-2">
                    {resourceIndex.map((item, i) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {i + 1}. {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className={`flex-1 w-full mx-auto transition-all duration-500 ease-in-out ${mode === "compact" ? "max-w-3xl" : "max-w-7xl"}`}>
          {/* Navigation and Controls */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={!isAndroid && { opacity: 0, x: -20 }}
              animate={!isAndroid && { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/resources"
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Resources</span>
              </Link>
            </motion.div>

            <div className="hidden md:block">
              <motion.div
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.05 }}
                onClick={toggleMode}
                className={`
                  cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl
                  backdrop-blur-sm border transition-all duration-300
                  ${mode === 'compact' 
                    ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30' 
                    : 'bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/30'}
                `}
              >
                {mode === 'compact' ? (
                  <Expand className="w-4 h-4 rotate-90" />
                ) : (
                   <PanelLeftClose className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{mode === 'compact' ? 'Full Width' : 'Compact'}</span>
              </motion.div>
            </div>
          </div>

          {/* Resource Content */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
                title={resources?.title}
              >
                {resources?.title}
              </h1>
              {resources?.topics?.topic_logo_url && (
                <img
                  src={resources?.topics?.topic_logo_url}
                  className="h-12 transition-transform hover:scale-105"
                  alt={resources?.title}
                  title={resources?.title}
                />
              )}
            </div>

            {resources?.description && (
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-3 text-primary/80">
                  About this Resource
                </h2>
                <p className="text-lg text-muted-foreground">
                  {resources?.description}
                </p>
              </div>
            )}

            <MDEditor.Markdown
              source={resources?.content}
              className="prose prose-invert max-w-none sm:text-lg"
            />
          </motion.div>
        </div>
      </div>

      {isAdmin && (
        <Link
          to={`/resource/edit/${id}`}
          className="fixed bottom-24 right-8 z-50 flex items-center gap-2 px-3 py-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all text-base font-semibold"
          title="Edit Note"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
        >
          <PenBox className="w-5 h-5" />
        </Link>
      )}
      <ScrollToTop />
    </>
  );
};

export default ResourcesPage;
