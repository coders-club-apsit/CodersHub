import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { SignedIn, SignedOut, UserButton, SignIn } from '@clerk/clerk-react';
import { PenBox, NotebookPen, Book, Link2 } from 'lucide-react';
import { ThemeToggle } from "./ThemeToggle";
import { motion } from 'framer-motion';

const Header = () => {
    const [search, setSearch] = useSearchParams();
    const [showSignIn, setShowSignIn] = useState(false);

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
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-blue-500/10"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="]mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to="/">
                                <img 
                                    src="/cc2.png" 
                                    className="h-16 hover:brightness-110 transition-all" 
                                    alt="Logo" 
                                />
                            </Link>
                        </motion.div>



                        <div className="flex items-center gap-6">
                            {/* <ThemeToggle /> */}
                            <SignedOut>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowSignIn(true)}
                                        className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300"
                                    >
                                        Login
                                    </Button>
                                </motion.div>
                            </SignedOut>

                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: 'w-10 h-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300',
                                            userButtonPopover: 'backdrop-blur-md bg-background/80 border border-blue-500/10',
                                        },
                                    }}
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="Saved Notes"
                                            labelIcon={<Book className="text-blue-500" size={15} />}
                                            href="/saved-notes"
                                        />
                                        <UserButton.Link
                                            label="Saved Resources"
                                            labelIcon={<Link2 className="text-blue-500" size={15} />}
                                            href="/saved-resources"
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {showSignIn && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <SignIn
                        signUpForceRedirectUrl="/"
                        fallbackRedirectUrl="/"
                    />
                </motion.div>
            )}
        </>
    );
};

export default Header;
