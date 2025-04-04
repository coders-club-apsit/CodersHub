import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const DecorativeSVG = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
    
    {/* Abstract Circles */}
    <svg className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-50" width="500" height="500">
      <motion.circle
        cx="250"
        cy="250"
        r="100"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0.8, opacity: 0.2 }}
        animate={{ 
          scale: [0.8, 1, 0.8],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-primary/30"
      />
    </svg>

    {/* Floating Code Symbols */}
    <div className="absolute top-20 right-20">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-4xl opacity-20"
      >
        {"{ }"}
      </motion.div>
    </div>
  </div>
);

const CodeBlock = () => (
  <motion.div 
    className="absolute bottom-20 right-10 hidden lg:block"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 0.7, x: 0 }}
    transition={{ duration: 0.5, delay: 0.8 }}
  >
    <pre className="text-sm bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-primary/10">
      <code className="text-primary/70">
        {`function solve(problem) {
  if (problem.isSolved) {
    return celebrate();
  }
  return keepLearning();
}`}
      </code>
    </pre>
  </motion.div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const arrowVariants = {
    initial: { y: 0 },
    hover: {
      x: 3,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center max-h-screen overflow-hidden -mt-12">
      <DecorativeSVG />
      
      {/* Gradient Background with Multiple Circles */}
      <div className="absolute inset-0 -z-10">
        {/* Main radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
        
        {/* Top left pink-violet gradient */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.3, 0.8],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 left-20 size-[400px] rounded-full bg-gradient-to-br from-pink-500/30 to-violet-600/30 blur-[100px]"
        />

        {/* Center-right blue-cyan gradient */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ 
            scale: [0.7, 1.2, 0.7],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute top-1/3 -right-32 size-[600px] rounded-full bg-gradient-to-l from-cyan-400/25 to-blue-600/25 blur-[120px]"
        />

        {/* Bottom-left violet-indigo gradient */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: [0.9, 1.4, 0.9],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -bottom-40 left-1/4 size-[500px] rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-400/30 blur-[90px]"
        />

        {/* Center small purple pulse */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ 
            scale: [0.6, 1, 0.6],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 size-[300px] rounded-full bg-gradient-to-r from-purple-500/40 to-fuchsia-500/40 blur-[80px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      
      {/* Content */}
      <div className="container px-8 mx-auto z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in [animation-delay:300ms]">
            Welcome to the <span className="text-gradient">Coder's Club</span> 
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground animate-fade-in [animation-delay:200ms]">
            Join our vibrant community of problem solvers and ace your coding interviews. 
            Learn Data Structures & Algorithms with hands-on practice and peer mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:400ms]">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="glass-card bg-hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all relative overflow-hidden group px-6 py-3 rounded-lg font-medium"
              onClick={() => navigate('/notes')}
            >
              <span className="relative z-10">Start Learning</span>
              <motion.span
                variants={arrowVariants}
                initial="initial"
                whileHover="hover"
                className="relative z-10 inline-block ml-2"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="glass-card hover:shadow-lg transition-all relative overflow-hidden group px-6 py-3 rounded-lg border border-primary/20 font-medium"
              onClick={() => window.open('https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', '_blank')}
            >
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </div>
      </div>

      <CodeBlock />
      
      {/* Animated Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ArrowDown className="h-6 w-6 text-primary/60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
