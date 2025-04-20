import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAndroid } from "react-device-detect";
import { useUser } from "@clerk/clerk-react";
import { ShineBorder } from "./magicui/shine-border";

const NeonCircles = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />

    {/* Neon Circles */}
    <div className="circle circle-1" />
    <div className="circle circle-2" />
    <div className="circle circle-3" />
  </div>
);

// Conditional wrapper for motion components
const MotionWrapper = ({ children, ...props }) => {
  if (isAndroid) {
    return <button className={props.className} onClick={props.onClick}>{children}</button>;
  }
  return <motion.div {...props}>{children}</motion.div>;
};

const CodeBlock = () => (
  <div className="absolute bottom-20 right-10 hidden lg:block">
    <pre className="text-sm bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-primary/10">
      <code className="text-primary/90">
        {`function solve(problem) {
  if (problem.isSolved) {
    return celebrate();
  }
  return keepLearning();
}`}
      </code>
    </pre>
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [hasSeenHero, setHasSeenHero] = useState(() => {
    return sessionStorage.getItem("hasSeenHeroSection") === "true";
  });

  useEffect(() => {
    if (!hasSeenHero) {
      sessionStorage.setItem("hasSeenHeroSection", "true");
      setHasSeenHero(true);
    }
  }, []);

  // Function to capitalize first letter only
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Only define animation variants if not on Android
  const buttonVariants = !isAndroid ? {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  } : {};

  const arrowVariants = !isAndroid ? {
    initial: { y: 0 },
    hover: {
      x: 3,
      transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    },
  } : {};

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NeonCircles />

      <div className="container px-8 mx-auto z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
            !isAndroid && !hasSeenHero ? "animate-fade-in [animation-delay:300ms]" : ""
          }`}>
            {isSignedIn ? (
              <>Welcome back <span className="text-gradient">{capitalizeFirstLetter(user.firstName)}.</span></>
            ) : (
              <>Welcome to the <span className="text-gradient">Coder's Club</span></>
            )}
          </h1>
          <p className={`text-lg md:text-xl mb-8 text-muted-foreground ${
            !isAndroid && !hasSeenHero ? "animate-fade-in [animation-delay:200ms]" : ""
          }`}>
            {isSignedIn ? (
              <>
                Ready to continue your coding journey? Explore our latest resources
                and practice problems to enhance your DSA skills.
              </>
            ) : (
              <>
                Join our vibrant community of problem solvers and ace your coding interviews.
                Learn Data Structures & Algorithms with hands-on practice and peer mentorship.
              </>
            )}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center  ${
            !isAndroid && !hasSeenHero ? "animate-fade-in [animation-delay:400ms]" : ""
          }`}>
            <MotionWrapper
              variants={buttonVariants}
              initial={!isAndroid && "initial"}
              whileHover={!isAndroid && "hover"}
              whileTap={!isAndroid && "tap"}
              className="glass-card bg-hero-gradient cursor-pointer hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-in-out relative overflow-hidden group px-8 py-4 rounded-2xl font-semibold backdrop-blur-lg"
              onClick={() => navigate('/notes')}
            >
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              <span className="relative z-10 flex items-center gap-2 text-white">
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionWrapper>

            <MotionWrapper
              variants={!isAndroid && buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="glass-card cursor-pointer relative overflow-hidden group px-8 py-4 rounded-2xl border border-primary/30 font-semibold hover:shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-lg"
              onClick={() => window.open('https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', '_blank')}
            >
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              <span className="relative z-10 text-white">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionWrapper>

          </div>
        </div>
      </div>

      <CodeBlock />

      {/* Scroll Indicator - Use CSS animation for Android */}
      <div className={`
        absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30
        ${isAndroid ? 'animate-bounce' : ''}
      `}>
        {!isAndroid ? (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowDown className="h-6 w-6 text-primary/60" />
          </motion.div>
        ) : (
          <ArrowDown className="h-6 w-6 text-primary/60" />
        )}
      </div>

      {/* Bottom black gradient shadow for seamless look */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#09090b] z-0" />
    </section>
  );
};

export default HeroSection;