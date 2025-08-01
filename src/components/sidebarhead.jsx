// src/components/sidebarhead.jsx
import React from 'react';
import { Badge, BadgeIcon, Link2, LucideAward, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { SignedIn, UserButton } from '@/components/auth/AuthComponents';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PenBox, NotebookPen, Save, Notebook } from 'lucide-react';

export function SideHeader({ searchQuery, setSearchQuery }) {
  return (
    <header className="border-b border-border bg-card fixed w-full top-0 left-0 z-50 backdrop-blur-md bg-background/80 shadow-sm flex justify-center">
      <div className="container py-3 flex items-center justify-between min-w-full px-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-4 text-primary">Students Corner</h1>
        </div>
        <div className="flex items-center space-x-4">
          
          <SignedIn>
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
                                            labelIcon={<PenBox size={15} />}
                                            href="/saved-notes"
                                        />
                                        <UserButton.Link
                                            label="Saved Resources"
                                            labelIcon={<Link2 size={15} />}
                                            href="/saved-resources"
                                        />
                                        <UserButton.Link
                                            label="Saved Projects"
                                            labelIcon={<LucideAward size={15} />}
                                            href="/saved-projects"
                                        />
                                        <UserButton.Link
                                            label="Saved Blogs"
                                            labelIcon={<Notebook size={15} />}
                                            href="/saved-blogs"
                                        />
                      
                    </UserButton.MenuItems>
                  </UserButton>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}