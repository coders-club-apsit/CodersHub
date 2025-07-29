import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { SignedIn, SignedOut, UserButton, SignIn } from '@clerk/clerk-react';
import { PenBox, NotebookPen, Book, Link2, Menu } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';
import { motion } from 'framer-motion';

const Header = () => {
    const [search, setSearch] = useSearchParams();
    const [showSignIn, setShowSignIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
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

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        }
    };

    useEffect(() => {
        if (search.get('sign-in')) {
            setShowSignIn(true);
        }
    }, [search]);

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
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowSignIn(true)}
                                        className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
                                            border-blue-500/20 hover:border-blue-500/40 
                                            hover:from-blue-500/20 hover:to-cyan-500/20 
                                            transition-all duration-300
                                            relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">Login</span>
                                        <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 
                                            group-hover:translate-y-[0%] transition-transform duration-300"></div>
                                    </Button>
                                </motion.div>
                            </SignedOut>

                            <SignedIn>
                                
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: 'w-10 h-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300',
                                            userButtonPopover: 'backdrop-blur-md bg-background/80 border border-blue-500/10 shadow-lg',
                                        },
                                    }}
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="Saved Notes"
                                            labelIcon={<Book size={15} />}
                                            href="/saved-notes"
                                        />
                                        <UserButton.Link
                                            label="Saved Resources"
                                            labelIcon={<Link2 size={15} />}
                                            href="/saved-resources"
                                        />
                                        <UserButton.Link
                                            label="Saved Projects"
                                            labelIcon={<Link2 size={15} />}
                                            href="/saved-projects"
                                        />
                                        <UserButton.Link
                                            label="Saved Blogs"
                                            labelIcon={<Link2 size={15} />}
                                            href="/saved-blogs"
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {showSignIn && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={handleOverlayClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SignIn
                                signUpForceRedirectUrl="/"
                                fallbackRedirectUrl="/"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
