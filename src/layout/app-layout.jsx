import Header from '@/components/header';
import DotPattern from '@/components/ui/dot-pattern';
import React, { useEffect } from 'react';
import { Outlet, useMatches, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline';
import { ToastContainer } from 'react-toastify';
import { useSessionTimeout } from '@/utils/session-timer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

const AppLayout = () => {
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();

  // List of routes where you don't want the footer
  const hideFooterRoutes = ["/aboutus", "/about-us"];

  // Initialize session timeout
  useSessionTimeout();

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
      <main className=" overflow-hidden">
        <Outlet />
      </main>
      <DotPattern
        className={cn(
          '-z-50 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(350px_circle_at_center,white,transparent)]'
        )}
      />
      <SpeedInsights/>
      <Analytics />
      {!hideFooterRoutes.includes(location.pathname) && (
        <div className="mt-12">
          <Footer />
        </div>
      )}
    </>
  );
};

export default AppLayout;