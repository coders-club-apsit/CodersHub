import React, { useState } from 'react';
import { getSavedResources } from '@/api/api-resources';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import ResourcesCard from '@/components/ResourcesCard';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SavedResources = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);
  

  const {
    loading: loadingSavedResources,
    data: savedResources,
    error,
    fn: fnSavedResources,
  } = useFetch(getSavedResources);

useEffect(() => {
  if (isLoaded) {
    if (!isSignedIn) {
      // Instead of toast, use alert:
      alert("Authentication required. Please sign in to view your saved resources.");
      navigate('/sign-in');
      return;
    }
    
    fnSavedResources();
  }
}, [isLoaded, isSignedIn, navigate]);
  
  useEffect(() => {
    // Set animation to false after data loads
    if (!loadingSavedResources && savedResources) {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [loadingSavedResources, savedResources]);

  if (!isLoaded || loadingSavedResources) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ExternalLink className="w-16 h-16 text-primary mb-4 animate-pulse" />
        <h2 className="text-xl font-medium mb-4">Loading your saved resources...</h2>
        <BarLoader color="#3b82f6" width="250px" height="4px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Resources</h2>
          <p className="text-muted-foreground mb-6">{error.message || "Failed to load your saved resources. Please try again."}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => fnSavedResources()}>
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
    <div>
      <Header/>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 mt-28'>
        Your Saved Resources
      </h1>

        {loadingSavedResources === false && (
          savedResources?.length ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {savedResources.map((saved) => (
                <motion.div key={saved.id} variants={item}>
                  <ResourcesCard 
                    resource={saved?.resource} 
                    savedInit={true} 
                    onResourceSaved={fnSavedResources}
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
                <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Saved Resources Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't saved any resources yet. Explore our collection and save resources for quick access.
                </p>
                <Button onClick={() => navigate('/resources')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  Browse Resources
                </Button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default SavedResources;
