// src/components/sidebarhead.jsx
import React from 'react';
import { Link2, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PenBox, NotebookPen, Save } from 'lucide-react';

export function SideHeader({ searchQuery, setSearchQuery }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
      </div>
    </header>
  );
}