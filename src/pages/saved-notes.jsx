import React, { useState } from 'react';
import { getSavedNotes } from '@/api/api-Notes';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import NoteCard from '@/components/NoteCard';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SavedNotes = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  const {
    loading: loadingSavedNotes,
    data: savedNotes,
    error,
    fn: fnSavedNotes,
  } = useFetch(getSavedNotes);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        alert("Authentication required. Please sign in to view your saved notes.");
        navigate('/sign-in');
        return;
      }
      
      fnSavedNotes();
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  useEffect(() => {
    // Set animation to false after data loads
    if (!loadingSavedNotes && savedNotes) {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [loadingSavedNotes, savedNotes]);

  if (!isLoaded || loadingSavedNotes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BookOpen className="w-16 h-16 text-primary mb-4 animate-pulse" />
        <h2 className="text-xl font-medium mb-4">Loading your saved notes...</h2>
        <BarLoader color="#3b82f6" width="250px" height="4px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Notes</h2>
          <p className="text-muted-foreground mb-6">{error.message || "Failed to load your saved notes. Please try again."}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => fnSavedNotes()}>
              Try Again
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 mx-auto pt-20">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <motion.h1 
          className='gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl text-center mb-6'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Saved Notes
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Access your favorite notes and study materials all in one place.
        </motion.p>

        {loadingSavedNotes === false && (
          savedNotes?.length ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {savedNotes.map((saved) => (
                <motion.div key={saved.id} variants={item}>
                  <NoteCard 
                    note={saved?.note} 
                    savedInit={true} 
                    onNoteSaved={fnSavedNotes}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16 px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-md mx-auto bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-border">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Saved Notes Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't saved any notes yet. Explore our collection and save notes for quick access.
                </p>
                <Button onClick={() => navigate('/notes')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  Browse Notes
                </Button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default SavedNotes;
