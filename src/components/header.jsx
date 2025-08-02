import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { SignedIn, SignedOut, UserButton, AuthButton } from '@/components/auth/AuthComponents';
import { PenBox, NotebookPen, Book, Link2, Menu, Settings } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';
import { useUser } from '@/contexts/AuthContext';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const { isAdmin } = useUser();
    
    // Track if initial animation has played
    const animationPlayedRef = useRef(false);
    const [shouldAnimate, setShouldAnimate] = useState(() => {
        return !sessionStorage.getItem("headerAnimated");
    });

    // Track scroll position for changing header appearance
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    // Set animation as played after first render
    useEffect(() => {
        if (shouldAnimate && !animationPlayedRef.current) {
            animationPlayedRef.current = true;
            sessionStorage.setItem("headerAnimated", "true");
        }
    }, [shouldAnimate]);

    return (
        <>
            <motion.nav 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled 
                    ? "bg-background/90 backdrop-blur-md shadow-lg border-b border-blue-500/10" 
                    : "bg-transparent border-b border-transparent"
                }`}
                initial={shouldAnimate ? { y: -100 } : { y: 0 }}
                animate={{ y: 0 }}
                transition={{ duration: shouldAnimate ? 0.4 : 0, ease: "easeOut" }}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
                        >
                            <Link to="/" className="flex items-center gap-2">
                                <img 
                                    src="/cc2.svg" 
                                    className="h-14 transition-all" 
                                    alt="Coders Club Logo" 
                                />
                            </Link>
                        </motion.div>

                        <div className="flex items-center gap-6">
                            {/* Additional nav items could go here */}
                            
                            <SignedOut>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                        duration: shouldAnimate ? 0.3 : 0,
                                        delay: shouldAnimate ? 0.2 : 0 
                                    }}
                                >
                                    <AuthButton 
                                        defaultTab="signin"
                                        variant="outline" 
                                        className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
                                            border-blue-500/20 hover:border-blue-500/40 
                                            hover:from-blue-500/20 hover:to-cyan-500/20 
                                            transition-all duration-300
                                            relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">Login</span>
                                        <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 
                                            group-hover:translate-y-[0%] transition-transform duration-300"></div>
                                    </AuthButton>
                                </motion.div>
                            </SignedOut>

                            <SignedIn>
                                {/* Admin Dashboard Button - Only visible to admins */}
                                {isAdmin && (
                                    <motion.div
                                        initial={shouldAnimate ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                            duration: shouldAnimate ? 0.3 : 0,
                                            delay: shouldAnimate ? 0.1 : 0 
                                        }}
                                    >
                                        <Link to="/admin-dashboard">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                                                    border-purple-500/20 hover:border-purple-500/40 
                                                    hover:from-purple-500/20 hover:to-pink-500/20 
                                                    transition-all duration-300
                                                    relative overflow-hidden group"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                <span className="relative z-10">Admin</span>
                                                <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                                                    group-hover:translate-y-[0%] transition-transform duration-300"></div>
                                            </Button>
                                        </Link>
                                    </motion.div>
                                )}
                                
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </motion.nav>
        </>
    );
};

export default Header;
