import React from "react";
import Header from "@/components/header";
import "@/components/HeroSection";
import { TextAnimate } from "@/components/ui/text-animate"; 
import "@/index.css";
import HeroSection from "@/components/HeroSection";
import FaqSection from "@/components/FaqSection";
import ResourcesSection from "@/components/ResourceSection";
import { motion } from "framer-motion";
import { isAndroid } from "react-device-detect";

function LandingPage() {
  const GradientOrbs = () => {
    if (isAndroid) {
      return (
        <>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px]" />
        </>
      );
    }

    return (
      <>
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden " style={{minWidth: "100vw"}}>
      {/* Background Graphics */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Orbs */}
        {/* <GradientOrbs /> */}
        
        {/* Radial Gradient */}
        {/* <div className="absolute inset-0 bg-gradient-radial from-transparent via-background to-background" /> */}
      </div>

      {/* Content */}
      <Header />
      <HeroSection />
      <ResourcesSection />
      <FaqSection />
    </div>
  );
}

export default LandingPage;