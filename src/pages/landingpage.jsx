import React, { lazy, Suspense, useState, useEffect } from "react";
import Header from "@/components/header";
import "@/components/HeroSection";
import "@/index.css";
import HeroSection from "@/components/HeroSection";
import FaqSection from "@/components/FaqSection";
import { motion, useReducedMotion } from "framer-motion"; // Add useReducedMotion
import { isAndroid } from "react-device-detect";
import Preloader from "@/components/Preloader";

const ResourcesSection = lazy(() => import('@/components/ResourceSection'));

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !isAndroid && !prefersReducedMotion;

  // Add loading state handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Show preloader while loading
  if (isLoading) {
    return <Preloader />;
  }

  // const GradientOrbs = () => {
  //   const baseStyles = {
  //     orb1: "absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]",
  //     orb2: "absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px]"
  //   };

  //   if (!shouldAnimate) {
  //     return (
  //       <>
  //         <div className={baseStyles.orb1} />
  //         <div className={baseStyles.orb2} />
  //       </>
  //     );
  //   }

  //   return (
  //     <>
  //       <motion.div
  //         className={baseStyles.orb1}
  //         animate={{
  //           scale: [1, 1.2, 1],
  //           opacity: [0.2, 0.3, 0.2],
  //         }}
  //         transition={{
  //           duration: 8,
  //           repeat: Infinity,
  //           ease: "easeInOut",
  //         }}
  //       />
  //       <motion.div
  //         className={baseStyles.orb2}
  //         animate={{
  //           scale: [1.2, 1, 1.2],
  //           opacity: [0.2, 0.3, 0.2],
  //         }}
  //         transition={{
  //           duration: 8,
  //           repeat: Infinity,
  //           ease: "easeInOut",
  //           delay: 1,
  //         }}
  //       />
  //     </>
  //   );
  // };

  return (
    <div className="relative min-h-screen overflow-hidden " style={{minWidth: "100vw"}}>

      {/* Content */}
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