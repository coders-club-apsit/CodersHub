import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAndroid } from "react-device-detect";

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
    return <div className={props.className}>{children}</div>;
  }
  return <motion.button {...props}>{children}</motion.button>;
};

const CodeBlock = () => (
  <div className="absolute bottom-20 right-10 hidden lg:block">
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
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const arrowVariants = {
    initial: { y: 0 },
    hover: {
      x: 3,
      transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center max-h-screen overflow-hidden -mt-12">
      <NeonCircles />

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
            <MotionWrapper
              variants={!isAndroid && buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="glass-card bg-hero-gradient text-white hover:shadow-lg hover:shadow-primary/25 transition-all relative overflow-hidden group px-6 py-3 rounded-lg font-medium"
              onClick={() => navigate('/notes')}
            >
              <span className="relative z-10">Start Learning</span>
              {!isAndroid ? (
                <motion.span
                  variants={arrowVariants}
                  initial="initial"
                  whileHover="hover"
                  className="relative z-10 inline-block ml-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              ) : (
                <span className="relative z-10 inline-block ml-2">
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionWrapper>

            <MotionWrapper
              variants={!isAndroid && buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="glass-card hover:shadow-lg transition-all relative overflow-hidden group px-6 py-3 rounded-lg border border-primary/20 font-medium"
              onClick={() => window.open('https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', '_blank')}
            >
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionWrapper>
          </div>
        </div>
      </div>

      <CodeBlock />

      {/* Scroll Indicator - Use CSS animation for Android */}
      <div className={`
        absolute bottom-10 left-1/2 transform -translate-x-1/2
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
    </section>
  );
};

export default HeroSection; 