import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import AboutUs from '@/pages/aboutus';
import { SignedIn, SignedOut, useUser, SignIn, UserButton } from '@clerk/clerk-react';
import { PenBox, NotebookPen, Save, SaveOff, Link2 } from 'lucide-react';

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
        
          <nav className="z-50 p-8 flex justify-between items-center">
            <Link to="/">
              <img src="/cc.png" className="h-14" alt="Logo" />
            </Link>
            <div className="flex gap-8">
              {/* When the user is signed out */}
              <SignedOut>
                <Button variant="outline" onClick={() => setShowSignIn(true)}>
                  Login
                </Button>
              </SignedOut>
    
              {/* When the user is signed in */}
              <SignedIn>
                {/* Show Post a Blog button only for admins */}
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10',
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Saved Notes"
                        labelIcon={<Save size={15} />}
                        href="/saved-notes"
                      />
                      <UserButton.Link
                        label="Saved Resources"
                        labelIcon={<Link2 size={15} />}
                        href="/saved-resources"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
              </SignedIn>
            </div>
          </nav>


          {showSignIn && (
        <div
          className="fixed flex inset-0 items-center bg-black bg-opacity-50 justify-center z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/"
            fallbackRedirectUrl="/"
          />
        </div>
      )}


        </>
      );
    };

export default Header
