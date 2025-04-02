import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch';
import { getSingleNote } from '@/api/api-Notes';
import { BarLoader, PropagateLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import Header from '@/components/header';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotePage = () => {

  const {isLoaded, user} = useUser();
  const { id } = useParams();

  const {
    fn: fnNotes,
    data: notes,
    loading: loadingNotes,
  } = useFetch(getSingleNote, { note_id: id, });

  useEffect(() => {
  if(isLoaded) fnNotes();
  }, [isLoaded]);

  if (!isLoaded || loadingNotes) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <Header/>
      <div className='flex flex-col gap-8 mt-9 pt-16 px-4 mx-auto'>
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
        
        <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
          <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{notes?.title}</h1>
          <img src={notes?.topics?.topic_logo_url} className='h-12' alt={notes?.title}></img>
        </div>
        
        <h2 className='text-2xl sm:text3xl font-bold'>About this Note</h2>
        <p className='sm:text-lg'>{notes?.description}</p>
        <MDEditor.Markdown source={notes?.content} className='bg-transparent sm:text-lg' />
      </div>
    </>
  )
}

export default NotePage
