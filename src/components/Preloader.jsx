import { motion } from "framer-motion";

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-center">
      <div className="relative">
        {/* Animated background rings */}
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-primary/20 blur-sm" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-blue-500/20 blur-sm" />
        </motion.div>

        <motion.div 
          className="flex flex-col items-center gap-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brain Logo with pulse effect */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.img
              src="/cc_brain.png"
              alt="Brain Logo"
              className="w-32 h-32 relative z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotateY: [0, 360],
              }}
              transition={{
                duration: 2,
                rotateY: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }
              }}
            />
          </div>

          {/* Loading text with animated dots */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {/* Animated Loading Text */}
              <motion.div
                className="flex overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {"Loading".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>

              {/* Animated Dots */}
              
            </div>

            {/* Subtle Status Message */}
            {/* <motion.p
              className="text-muted-foreground/80 text-sm font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Preparing your coding experience
            </motion.p> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Preloader;