import React from 'react'
import { getSavedResources } from '@/api/api-resources';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import ResourcesCard from '@/components/ResourcesCard';
import Header from '@/components/header';

const savedResources = () => {

  const {isLoaded} = useUser();

  const{
    loading: loadingSavedResources,
    data: savedResource,
    fn: fnSavedResources,
  }= useFetch(getSavedResources);


  useEffect(() => {
    if(isLoaded) fnSavedResources();
  }, [isLoaded])

  if(!isLoaded || loadingSavedResources){
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />
  }


  return (
    <div>
      <Header/>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 pt-10'>
        Your Saved Resources
      </h1>

      {loadingSavedResources === false && (
        <div className=" mt-8 grid md:grid-cols-2 lg:grid-cols-3 m-8 gap-4">
          {savedResource?.length? (
            savedResource.map((saved)=>{
               return <ResourcesCard key={saved.id} resource={saved?.resource} savedInit={true} onResourceSaved={fnSavedResources}/>
            })
          ):(
            <div>No Saved Resources found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default savedResources
