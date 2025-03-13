import Header from '@/components/header';
import DotPattern from '@/components/ui/dot-pattern';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline';
import { ToastContainer } from 'react-toastify';

const AppLayout = () => {
  return (
    <>
    
      <main className="container mx-auto min-h-screen">
      {/* <ToastContainer /> */}
        <Outlet />
        
      </main>
      <DotPattern
        className={cn(
          '-z-50 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]'
        )}
      />
      <div className="mt-12">
        <Footer />
      </div>
      </>
  );
};

export default AppLayout;