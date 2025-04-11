import React, { useState, useEffect } from "react";
import { ADMIN_EMAILS } from "@/config/admin";
import { useUser } from "@clerk/clerk-react";
import {
  ClapperboardIcon as ChalkboardTeacher,
  Book,
  Cog,
  LogOut,
  HouseIcon,
  LinkIcon,
  Info,
  CreativeCommons,
  FileBadge,
  Badge,
  Award,
  AwardIcon,
  LucideAward,
  Calendar,
} from "lucide-react";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import { PenBox, NotebookPen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { FaAward } from "react-icons/fa";


export function Sidebar() {
  const { state } = useSidebar();
  const [search, setSearch] = useSearchParams();
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser(); // Get user data from Clerk
  const location = useLocation(); // Get current route

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <ShadSidebar className="bg-card">
      <SidebarHeader className="bg-opacity-50 bg-black">
        <h2 className="text-2xl sm:text-xl font-bold text-primary p-3">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent className="bg-black/10 space-y-4">
        <SignedIn>
        <SidebarMenu className="space-y-2 p-2">
            {[
              { path: "/", icon: HouseIcon, label: "Home" },
              { path: "/notes", icon: Book, label: "Notes" },
              { path: "/resources", icon: LinkIcon, label: "Resources" },
              { path: "/about-us", icon: Info, label: "About us" },
              { path: "/events", icon: Calendar, label: "Events" },
            ].map(({ path, icon: Icon, label }) => (
              <SidebarMenuItem key={path}>
                <SidebarMenuButton asChild>
                  <Link to={path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start rounded-lg text-base font-medium
                        transition-all duration-200 ease-in-out
                        ${isActive(path) 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-foreground hover:bg-primary/5 hover:text-primary"
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                      {label}
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SignedIn>

        
      </SidebarContent>
      <SidebarFooter className="border-t border-primary/10 bg-black/20 space-y-2 p-2">
      {isAdmin && (
          <div className="space-y-3 mb-2">
            {[
              { path: "/add-notes", icon: PenBox, label: "Add Notes" },
              { path: "/add-resources", icon: LinkIcon, label: "Add Resources" },
            ].map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base font-medium
                    text-foreground hover:text-primary hover:bg-primary/5
                    transition-all duration-200 ease-in-out"
                >
                  <Icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  {label}
                </Button>
              </Link>
            ))}
            <SignOutButton>
          <Button
            variant="ghost"
            className="w-full justify-start text-base font-medium
              text-foreground hover:text-red-500 hover:bg-red-500/5
              transition-all duration-200 ease-in-out group"
          >
            <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
            Logout
          </Button>
        </SignOutButton>
          </div>
        )}

        
      </SidebarFooter>
    </ShadSidebar>
  );
}
