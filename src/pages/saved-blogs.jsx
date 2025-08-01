import React from 'react'
import { getSavedBlog } from '@/api/api-blogs';
import { useUser } from '@/contexts/AuthContext';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/header';
import BlogCard from '@/components/Blogcard';

const SavedBlogs = () => {

  const {isLoaded} = useUser();

  const{
    loading: loadingSavedBlog,
    data: savedBlogs,
    fn: fnSavedBlogs,
  }= useFetch(getSavedBlog);


  useEffect(() => {
    if(isLoaded) fnSavedBlogs();
  }, [isLoaded])

  if(!isLoaded || loadingSavedBlog){
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />
  }


  return (
    <div>
      <Header/>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 mt-28'>
        Your Saved Blogs
      </h1>

      {loadingSavedBlog === false && (
        <div className=" mt-8 grid md:grid-cols-2 lg:grid-cols-3 m-8 gap-4 items-center">
          {savedBlogs?.length? (
            savedBlogs.map((saved)=>{
               return <BlogCard key={saved.id} blog={saved?.blog} savedInit={true} onBlogSaved={fnSavedBlogs}/>
            })
          ):(
            <div>No Saved BLogs found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedBlogs
