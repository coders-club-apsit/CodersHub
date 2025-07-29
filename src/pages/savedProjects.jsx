import React from 'react'
import { getSavedProjects } from '@/api/api-projects';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/header';

const SavedProjects = () => {

  const {isLoaded} = useUser();

  const{
    loading: loadingSavedProject,
    data: savedProject,
    fn: fnSavedProjects,
  }= useFetch(getSavedProjects);


  useEffect(() => {
    if(isLoaded) fnSavedProjects();
  }, [isLoaded])

  if(!isLoaded || loadingSavedProject){
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />
  }


  return (
    <div>
      <Header/>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 mt-28'>
        Your Saved Projects
      </h1>

      {loadingSavedProject === false && (
        <div className=" mt-8 grid md:grid-cols-2 lg:grid-cols-3 m-8 gap-4 items-center">
          {savedProject?.length? (
            savedProject.map((saved)=>{
               return <ProjectCard key={saved.id} project={saved?.project} savedInit={true} onProjectSaved={fnSavedProjects}/>
            })
          ):(
            <div>No Saved Projects found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedProjects
