import React, { lazy, Suspense, useState, useEffect } from "react";
import Header from "@/components/header";
import "@/components/HeroSection";
import "@/index.css";
import HeroSection from "@/components/HeroSection";
import FaqSection from "@/components/FaqSection";
import { motion, useReducedMotion } from "framer-motion";
import { isAndroid } from "react-device-detect";
import Preloader from "@/components/Preloader";
import ResourcesSection from '@/components/ResourceSection';

function LandingPage() {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show preloader if not visited in this session
    return !sessionStorage.getItem("hasVisitedThisSession");
  });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !isAndroid && !prefersReducedMotion;

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisitedThisSession", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden " style={{minWidth: "100vw"}}>
      <Header />
      <HeroSection />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <ResourcesSection />
      </Suspense>
      <FaqSection />
    </div>
  );
}

export default LandingPage;