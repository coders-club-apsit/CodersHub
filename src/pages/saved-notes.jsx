import React from 'react'
import { getSavedNotes } from '@/api/api-Notes';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import NoteCard from '@/components/NoteCard';
import Header from '@/components/header';

const savedNotes = () => {

  const {isLoaded} = useUser();

  const{
    loading: loadingSavedNotes,
    data: savedNote,
    fn: fnSavedNotes,
  }= useFetch(getSavedNotes);


  useEffect(() => {
    if(isLoaded) fnSavedNotes();
  }, [isLoaded])

  if(!isLoaded || loadingSavedNotes){
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />
  }


  return (
    <div>
      <Header/>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 pt-10'>
        Your Saved Notes
      </h1>

      {loadingSavedNotes === false && (
        <div className=" mt-8 grid md:grid-cols-2 lg:grid-cols-3 m-8 gap-4">
          {savedNote?.length? (
            savedNote.map((saved)=>{
               return <NoteCard key={saved.id} note={saved?.note} savedInit={true} onNoteSaved={fnSavedNotes}/>
            })
          ):(
            <div>No Saved Notes found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default savedNotes
