import { motion } from "framer-motion";

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur z-50 flex items-center justify-center lg:flex-row">
      <div className="relative">
        {/* Animated background rings */}
        {/* <motion.div 
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-primary/20 blur-sm" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-blue-500/20 blur-sm" />
        </motion.div> */}

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
        </motion.div>
      </div>
    </div>
  );
};

export default Preloader;
