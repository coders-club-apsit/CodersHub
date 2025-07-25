import React, { useEffect, useState, useRef, useCallback } from "react";
import { ArrowDown, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAndroid } from "react-device-detect";
import { useUser } from "@clerk/clerk-react";
import { ShineBorder } from "./magicui/shine-border";
import { getDailyNugget as getWeeklyNugget } from "../data/codeNuggets";

// Add this analytics tracking helper function
const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...eventParams,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log(`Analytics event (gtag not loaded): ${eventName}`, eventParams);
  }
};

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

const CodeBlock = () => {
  // Use ref to track if animation has already run
  const animationPlayedRef = useRef(false);
  // Determine if we should animate on mount
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    return !sessionStorage.getItem("codeBlockAnimated");
  });
  
  // Define animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, delay: 0.5 }
    },
    alreadySeen: {
      opacity: 1,
      y: 0,
      transition: { duration: 0 }
    }
  };

  const lineHighlightVariants = {
    initial: { width: "0%" },
    animate: { 
      width: "100%",
      transition: { 
        duration: 0.8, 
        delay: 1.5,
        ease: "easeInOut" 
      }
    }
  };

  // Cursor blink effect
  const cursorVariants = {
    blink: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  // Set animation as played after first render
  useEffect(() => {
    if (shouldAnimate && !animationPlayedRef.current) {
      animationPlayedRef.current = true;
      sessionStorage.setItem("codeBlockAnimated", "true");
    }
  }, [shouldAnimate]);

  return (
    <motion.div 
      className="absolute bottom-20 left-10 hidden lg:block"
      variants={containerVariants}
      initial={shouldAnimate ? "initial" : "alreadySeen"}
      animate="animate"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5  rounded-lg opacity-30 
          group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
        
        <pre className="relative text-sm bg-black/50 backdrop-blur-md p-4 rounded-lg border border-primary/20 
          shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] transition-all duration-300">
          <code className="text-primary/90 font-mono">
            <div className="flex flex-col">
              <motion.div className="flex"
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 0.8 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="text-blue-400">function</span>
                <span className="text-white"> solve(</span>
                <span className="text-yellow-300">problem</span>
                <span className="text-white">) {'{'}</span>
              </motion.div>
              
              <motion.div 
                className="relative pl-4 my-1" 
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 1.0 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="flex items-center">
                  <span className="text-pink-400">if</span>
                  <span className="text-white"> (</span>
                  <span className="text-yellow-300">problem</span>
                  <span className="text-white">.</span>
                  <span className="text-green-400">isSolved</span>
                  <span className="text-white">) {'{'}</span>
                  
                </span>
              </motion.div>
              
              <motion.div 
                className="pl-8" 
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 1.2 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="text-blue-400">return</span>
                <span className="text-cyan-300"> celebrate</span>
                <span className="text-white">();</span>
              </motion.div>
              
              <motion.div 
                className="pl-4" 
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 1.4 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="text-white">{'}'}</span>
              </motion.div>
              
              <motion.div 
                className="pl-4 flex" 
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 1.6 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="text-blue-400">return</span>
                <span className="text-cyan-300"> keepLearning</span>
                <span className="text-white">();</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: shouldAnimate ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: shouldAnimate ? 1.8 : 0, duration: shouldAnimate ? 0.3 : 0 }}
              >
                <span className="text-white">{'}'}</span>
                <motion.span 
                  className="inline-block w-2 h-4 ml-1 -mb-1 bg-primary/90" 
                  variants={cursorVariants}
                  animate="blink"
                />
              </motion.div>
            </div>
          </code>
        </pre>
        
        {/* Moving glow effect */}
        <motion.div 
          className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/20 via-primary/20 to-cyan-500/20 blur z-[-1]"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  // Helper function - moved to top of component
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // State definitions
  const [hasSeenHero, setHasSeenHero] = useState(() => {
    return sessionStorage.getItem("hasSeenHeroSection") === "true";
  });

  const [dailyNugget, setDailyNugget] = useState("");
  const [showNugget, setShowNugget] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [nuggetPosition, setNuggetPosition] = useState("absolute");
  const nuggetRef = useRef(null);
  const [showDesktopNugget, setShowDesktopNugget] = useState(false); // Changed from true to false
  const [showMobileNugget, setShowMobileNugget] = useState(false);
  const [hasSeenWeeklyNugget, setHasSeenWeeklyNugget] = useState(() => {
    const currentWeek = getWeekNumber(new Date());
    return localStorage.getItem(`weeklyNugget_${currentWeek}`) === "seen";
  });

  useEffect(() => {
    if (!hasSeenHero) {
      sessionStorage.setItem("hasSeenHeroSection", "true");
      setHasSeenHero(true);
    }
  }, []);

  useEffect(() => {
    // Get the daily nugget from our data module
    setDailyNugget(getWeeklyNugget());
    
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // When scroll position reaches the threshold, change position to fixed
      if (window.scrollY > 75) { // Adjust this threshold as needed
        setNuggetPosition("fixed");
      } else {
        setNuggetPosition("absolute");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Add useEffect to handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nuggetRef.current && !nuggetRef.current.contains(event.target) && 
          showDesktopNugget && !event.target.closest('button')) {
        setShowDesktopNugget(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDesktopNugget]);

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
            className="glass-card cursor-pointer relative overflow-hidden group 
              px-6 py-3 rounded-lg font-medium 
              bg-gradient-to-br from-blue-600/30 to-blue-400/20
              border border-blue-500/30 hover:border-blue-400/60
              hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]
              transition-all duration-300"
            onClick={() => navigate('/notes')}
          >
            <ShineBorder shineColor={["#3B82F6", "#06B6D4", "#2563EB"]} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2 text-white group-hover:tracking-wide transition-all duration-300">
              Start Learning
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </MotionWrapper>

          <MotionWrapper
            variants={!isAndroid && buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="glass-card cursor-pointer relative overflow-hidden group
              px-6 py-3 rounded-lg font-medium
              bg-gradient-to-br from-primary/20 to-purple-500/10
              border border-primary/30 hover:border-primary/60
              hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
              transition-all duration-300"
            onClick={() => window.open('https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', '_blank')}
          >
            <ShineBorder shineColor={["#8B5CF6", "#D946EF", "#7C3AED"]} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-purple-500/20 transition-opacity duration-300"></div>
            <span className="relative z-10 text-white group-hover:tracking-wide transition-all duration-300">
              Join Our Community
            </span>
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

      {/* Desktop Toggle Button */}
      <motion.button
        className="hidden sm:flex fixed bottom-8 right-4 z-[100] bg-gradient-to-br from-blue-500 via-primary to-fuchsia-500 p-3 rounded-full shadow-lg border border-primary/30 relative"
        style={{ position: 'fixed', transform: 'translateZ(0)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Track the event
          trackEvent('code_nugget_clicked', { 
            device: 'desktop',
            nugget_state: showDesktopNugget ? 'closed' : 'opened',
            is_new: !hasSeenWeeklyNugget
          });
          
          // Original logic
          setShowDesktopNugget(prev => !prev);
          if (!hasSeenWeeklyNugget) {
            setHasSeenWeeklyNugget(true);
            const currentWeek = getWeekNumber(new Date());
            localStorage.setItem(`weeklyNugget_${currentWeek}`, "seen");
          }
        }}
        aria-label="Toggle Code Nugget"
      >
        <Lightbulb className="h-5 w-5 text-white" />
        {!hasSeenWeeklyNugget && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          >
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Mobile Toggle Button */}
      <motion.button
        className="sm:hidden fixed bottom-8 right-4 z-[100] bg-gradient-to-br from-blue-500 via-primary to-fuchsia-500 p-3 rounded-full shadow-lg border border-primary/30 touch-manipulation relative"
        style={{ position: 'fixed', transform: 'translateZ(0)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          // Track the event
          trackEvent('code_nugget_clicked', { 
            device: 'mobile',
            nugget_state: showMobileNugget ? 'closed' : 'opened',
            is_new: !hasSeenWeeklyNugget
          });
          
          // Original logic
          setShowMobileNugget(prev => !prev);
          if (!hasSeenWeeklyNugget) {
            setHasSeenWeeklyNugget(true);
            const currentWeek = getWeekNumber(new Date());
            localStorage.setItem(`weeklyNugget_${currentWeek}`, "seen");
          }
        }}
        aria-label="Toggle Code Nugget"
      >
        <Lightbulb className="h-5 w-5 text-white" />
        {!hasSeenWeeklyNugget && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          >
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Desktop version - Fixed above toggle button */}
      <AnimatePresence>
        {showDesktopNugget && (
          <motion.div 
            ref={nuggetRef}
            className="hidden sm:flex fixed bottom-24 right-4 z-50"
            style={{ 
              maxWidth: "calc(100vw - 32px)",
              width: "320px"
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 350
            }}
          >
            <div className="group relative">
              {/* Chat bubble pointer arrow */}
              <div className="absolute w-4 h-4 bg-gradient-to-br from-black/90 to-black/80 border-r border-b border-primary/30 transform rotate-45 -bottom-2 right-6"></div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/30 via-primary/30 to-fuchsia-500/30 blur opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content container */}
              <div className="flex flex-col relative bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md p-3 rounded-xl border border-primary/30 shadow-lg">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 via-primary to-fuchsia-500 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary font-medium text-sm">
                    Weekly Code Nugget
                  </span>
                </div>
                
                {/* Content */}
                <p className="text-xs text-white/90 max-h-[25vh] overflow-y-auto pr-1 overscroll-contain will-change-scroll">
                  {dailyNugget}
                </p>

              </div>
              
              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nugget - Optimized chat bubble with better touch handling */}
      <AnimatePresence mode="wait">
        {showMobileNugget && (
          <>
            {/* Invisible backdrop with improved touch handling */}
            <motion.div
              className="sm:hidden fixed inset-0 z-40 bg-transparent touch-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowMobileNugget(false)}
              aria-label="Close nugget"
            />
            
            <motion.div 
              className="sm:hidden fixed z-50 touch-manipulation"
              style={{ 
                bottom: "70px",
                right: "16px",
                maxWidth: "calc(100vw - 32px)",
                width: "320px"
              }}
              initial={{ opacity: 0, scale: 0.5, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 350,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="group relative">
                {/* Chat bubble pointer arrow */}
                <div className="absolute w-4 h-4 bg-gradient-to-br from-black/90 to-black/80 border-r border-b border-primary/30 transform rotate-45 -bottom-2 right-6"></div>
                
                {/* Optimized glow effect - reduced blur for better performance */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/30 via-primary/30 to-fuchsia-500/30 blur opacity-70 transition-opacity duration-300" />
                
                {/* Content container with simplified gradient */}
                <div className="flex flex-col relative bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md p-3 rounded-xl border border-primary/30 mb-4 shadow-lg">
                  {/* Header with simplified animation */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 via-primary to-fuchsia-500 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary font-medium text-sm">
                      Weekly Code Nugget
                    </span>
                  </div>
                  
                  {/* Content with optimized scrolling */}
                  <p className="text-xs text-white/90 max-h-[25vh] overflow-y-auto pr-1 overscroll-contain will-change-scroll">
                    {dailyNugget}
                  </p>
                  
                  {/* Tap to dismiss hint */}
                  <p className="text-xs text-white/50 text-center mt-2 italic">
                    Tap anywhere to dismiss
                  </p>
                </div>
                
                {/* Simplified shine animation for better performance */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["100% 0", "-100% 0"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;