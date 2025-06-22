// note.jsx
import { useState, useEffect, useMemo } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';
import { useParams, Link } from 'react-router-dom';
import { getSingleNote } from '@/api/api-Notes';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import Header from '@/components/header';
import { ArrowLeft, Expand, PanelLeftClose, PenBox, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { isAndroid } from 'react-device-detect';
import { useQuery } from '@tanstack/react-query';
import ScrollToTop from '@/components/ScrollToTop';
import { ADMIN_EMAILS } from "@/config/admin"; // Make sure this path is correct

const extractIndex = (content) => {
  if (!content) return [];
  // Match lines like: 1. [Title](#anchor)
  const indexRegex = /^\d+\.\s+\[([^\]]+)\]\((#[^)]+)\)/gm;
  const matches = [];
  let match;
  while ((match = indexRegex.exec(content)) !== null) {
    matches.push({ label: match[1], href: match[2] });
  }
  return matches;
};

const NotePage = () => {
  const { isLoaded } = useUser();
  const { session } = useSession();
  const { id } = useParams();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [indexCollapsed, setIndexCollapsed] = useState(false);

  const estimateReadingTime = (content) => {
  if (!content) return 0;
  const words = content.replace(/[^\w\s]/g, '').split(/\s+/).length;
  return Math.ceil(words / 200); // Average reading speed: 200 words per minute
};

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const token = await session.getToken({ template: 'supabase' });
      return getSingleNote(token, { note_id: id });
    },
    enabled: isLoaded,
  });

  

  const [mode, setMode] = useState(() => localStorage.getItem('readingMode') || 'compact');

  useEffect(() => {
    localStorage.setItem('readingMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'compact' ? 'expanded' : 'compact'));
  };

  // Memoize index extraction for performance
  const noteIndex = useMemo(() => extractIndex(notes?.content), [notes?.content]);
  const readingTime = useMemo(() => estimateReadingTime(notes?.content), [notes?.content]);

  if (!isLoaded || loadingNotes) {
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%"/>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-background to-background/50 flex">
        {/* Sidebar Index */}
        {noteIndex.length > 0 && (
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
                  rounded-md p-2 flex items-center justify-center
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
                    {noteIndex.map((item, i) => (
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
        <div className={`flex-1 w-full mx-auto transition-all duration-500 ease-in-out ${mode === 'compact' ? 'max-w-3xl' : 'max-w-7xl'}`}>
          {/* Navigation and Controls */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={!isAndroid && { opacity: 0, x: -20 }}
              animate={!isAndroid && { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <Link to="/notes" className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Notes</span>
              </Link>
            </motion.div>
            <div className="hidden md:flex items-center gap-4">
              {readingTime > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{readingTime} min read</span>
                </div>
              )}
              
              <motion.div
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.02 }}
                onClick={toggleMode}
                className={`
                  cursor-pointer flex items-center gap-3 px-5 py-2 rounded-xl
                  backdrop-blur-sm border transition-all duration-300 font-medium shadow-sm hover:shadow-md
                  ${mode === 'compact' 
                    ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/30 text-orange-600 dark:text-orange-400'}
                `}
              >
                {mode === 'compact' ? (
                  <Expand className="w-5 h-5 rotate-90" />
                ) : (
                   <PanelLeftClose className="w-5 h-5" />
                )}
                <span className="text-sm">{mode === 'compact' ? 'Expand View' : 'Compact View'}</span>
              </motion.div>
            </div>
          </div>

          {/* Note Content */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500" title={notes?.title}>
                {notes?.title}
              </h1>
              {notes?.topics?.topic_logo_url && (
                <img src={notes?.topics?.topic_logo_url} className="h-12 transition-transform hover:scale-105" alt={notes?.title} />
              )}
            </div>

            {notes?.description && (
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-3 text-primary/80">About this Note</h2>
                <p className="text-lg text-muted-foreground">{notes?.description}</p>
              </div>
            )}

            {/* Responsive Markdown Content */}
            <div className="overflow-x-auto">
              <MDEditor.Markdown
                source={notes?.content}
                className="prose prose-invert max-w-none sm:text-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="fixed bottom-4 right-8 z-50 flex flex-col gap-4 items-center">
      {isAdmin && (
        <Link
          to={`/note/edit/${id}`}
          className="flex items-center gap-2 px-3 py-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all text-base font-semibold"
          title="Edit Note"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
        >
          <PenBox className="w-5 h-5" />
        </Link>
      )}
      <ScrollToTop />
      </div>
    </>
  );
};

export default NotePage;
