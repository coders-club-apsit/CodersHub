import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch';
import { getSingleNote } from '@/api/api-Notes';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import Header from '@/components/header';
import { ArrowLeft, Expand } from 'lucide-react';
import { motion } from 'framer-motion';
import { isAndroid } from 'react-device-detect';

const NotePage = () => {
  const { isLoaded } = useUser();
  const { id } = useParams();

  const {
    fn: fnNotes,
    data: notes,
    loading: loadingNotes,
  } = useFetch(getSingleNote, { note_id: id });

  const [mode, setMode] = useState(() => localStorage.getItem('readingMode') || 'compact');

  useEffect(() => {
    if (isLoaded) fnNotes();
  }, [isLoaded]);

  useEffect(() => {
    localStorage.setItem('readingMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'compact' ? 'expanded' : 'compact'));
  };

  if (!isLoaded || loadingNotes) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-background to-background/50">
        <div className={`mx-auto transition-all duration-500 ease-in-out
          ${mode === 'compact' ? 'max-w-3xl' : 'max-w-7xl'}
        `}>
          {/* Navigation and Controls */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={!isAndroid && { opacity: 0, x: -20 }}
              animate={!isAndroid && { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/notes"
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Notes</span>
              </Link>
            </motion.div>

            {/* Hide width toggle on mobile */}
            <div className="hidden md:block">
              <motion.button
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.05 }}
                onClick={toggleMode}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  backdrop-blur-sm border transition-all duration-300
                  ${mode === 'compact' 
                    ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30' 
                    : 'bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/30'}
                `}
              >
                <Expand className={`w-4 h-4 transition-transform ${mode === 'compact' ? 'rotate-0' : 'rotate-90'}`} />
                <span className="text-sm font-medium">{mode === 'compact' ? 'Full Width' : 'Compact'}</span>
              </motion.button>
            </div>
          </div>

          {/* Note Content */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Title and Topic Logo */}
            <div className="space-y-4">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
                title={notes?.title}
              >
                {notes?.title}
              </h1>
              {notes?.topics?.topic_logo_url && (
                <img
                  src={notes?.topics?.topic_logo_url}
                  className="h-12 transition-transform hover:scale-105"
                  alt={notes?.title}
                  title={notes?.title}
                />
              )}
            </div>

            {/* Description */}
            {notes?.description && (
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-3 text-primary/80">About this Note</h2>
                <p className="text-lg text-muted-foreground">{notes?.description}</p>
              </div>
            )}

            {/* Content */} 
              <MDEditor.Markdown
                source={notes?.content}
                className="prose prose-invert max-w-none sm:text-lg"
              />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotePage;
