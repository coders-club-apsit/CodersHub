import Header from '@/components/header';
import DotPattern from '@/components/ui/dot-pattern';
import React, { useEffect } from 'react';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline';
import { ToastContainer } from 'react-toastify';

const AppLayout = () => {
  const matches = useMatches();
  const navigate = useNavigate();

  useEffect(() => {
    const isPrivacyPolicy = matches.some(match => match.pathname === '/privacy-policy');
    
    if (isPrivacyPolicy) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [matches, navigate]);

  return (
    <>
      <main className=" mx-auto min-h-screen">
        <Outlet />
      </main>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default AppLayout;