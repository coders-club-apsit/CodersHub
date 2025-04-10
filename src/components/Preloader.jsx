import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = () => {
 

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-background/60 backdrop-blur z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative">
         
          <motion.div 
            className="flex flex-col items-center gap-8 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced Brain Logo Animation */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.img
                src="/cc_brain.png"
                alt="Brain Logo"
                className="w-32 h-32 relative z-10"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Enhanced Loading Text Animation */}
            {/* <div className="flex flex-col items-center gap-2">
              <motion.div className="flex overflow-hidden">
                {loadingText.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
                    initial={{ y: 50 }}
                    animate={{ 
                      y: 0,
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.05,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>
              =
              <motion.span 
                className="text-sm text-primary/60"
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {progress}%
              </motion.span>
            </div> */}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;