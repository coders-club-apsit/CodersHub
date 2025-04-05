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
      <div
        className={`mt-9 pt-16 px-4 transition-all duration-300 ${
          mode === 'compact'
            ? 'md:px-8 lg:px-16 mx-auto max-w-4xl'
            : 'w-full px-6 sm:px-10 md:px-20 lg:px-32'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Notes</span>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6 md:flex-row justify-between items-center mb-4">
          <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
            {notes?.title}
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={toggleMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md text-sm font-medium transition
              ${mode === 'compact' ? 'bg-muted hover:bg-muted/80' : 'bg-primary/10 hover:bg-primary/20'}
            `}
          >
            <Expand className="w-4 h-4" />
            {mode === 'compact' ? 'Full Width' : 'Compact'}
          </motion.button>
        </div>

        <img
          src={notes?.topics?.topic_logo_url}
          className="h-12 mb-6"
          alt={notes?.title}
        />

        <h2 className="text-2xl sm:text-3xl font-bold mt-6">About this Note</h2>
        <p className="sm:text-lg">{notes?.description}</p>

        <MDEditor.Markdown
          source={notes?.content}
          className="bg-transparent sm:text-lg mt-6"
        />
      </div>
    </>
  );
};

export default NotePage;
