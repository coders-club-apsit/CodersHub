import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/header';
const NotFound = () => {
  const navigate = useNavigate();

  const codeLines = [
    { color: 'text-blue-400', content: 'function' },
    { color: 'text-white', content: 'findPage' },
    { color: 'text-white', content: '() {' },
    { color: 'text-pink-400', content: '  if' },
    { color: 'text-white', content: '(page === ' },
    { color: 'text-yellow-300', content: '"404"' },
    { color: 'text-white', content: ') {' },
    { color: 'text-blue-400', content: '    return' },
    { color: 'text-green-400', content: '    "Page Not Found";' },
    { color: 'text-white', content: '  }' },
    { color: 'text-white', content: '}' },
  ];

  return (
    <>
      <Header />
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        {/* Code Snippet */}
    <motion.div 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-[20rem] font-bold leading-none select-none"
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="bg-gradient-to-r from-blue-500 via-primary to-fuchsia-500 bg-clip-text text-transparent">
            4
          </span>
          <span className="bg-gradient-to-r from-fuchsia-500 via-primary to-blue-500 bg-clip-text text-transparent">
            0
          </span>
          <span className="bg-gradient-to-r from-blue-500 via-primary to-fuchsia-500 bg-clip-text text-transparent">
            4
          </span>
        </motion.div>
        {/* Message */}
        <motion.p 
          className="text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Oops! Looks like this page got lost in the code.
        </motion.p>

        {/* Back Button */}
        <motion.button
          className="glass-card cursor-pointer relative overflow-hidden group 
            px-6 py-3 rounded-lg font-medium 
            bg-gradient-to-br from-blue-600/30 to-blue-400/20
            border border-blue-500/30 hover:border-blue-400/60
            hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]
            transition-all duration-300"
          onClick={() => navigate('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-2 text-white group-hover:tracking-wide transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </span>
        </motion.button>
        </motion.div>
    </div>
    </>
  );
};

export default NotFound;