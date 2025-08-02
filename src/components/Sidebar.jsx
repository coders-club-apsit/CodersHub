import React, { useState, useEffect } from "react";
import { ADMIN_EMAILS } from "@/config/admin";
import { useUser } from "@/contexts/AuthContext";
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
  Users,
  Notebook,
  Link2,
  Plus,
  ChevronDown,
  Settings,
  Bell,
} from "lucide-react";
import { SignedIn, SignedOut, SignOutButton } from "@/components/auth/AuthComponents";
import { PenBox, NotebookPen, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const routes = [
  { path: "/", icon: HouseIcon, label: "Home" },
  { path: "/notes", icon: Book, label: "Notes" },
  { path: "/resources", icon: LinkIcon, label: "Resources" },
  { path: "/projects", icon: LucideAward, label: "Projects" },
  { path: "/blogs", icon: Notebook, label: "Blogs" },
  { path: "/events", icon: Calendar, label: "Events" },
  { path: "/team-members", icon: Users, label: "Our Team", color: "text-violet-500" },
];

const adminAddItems = [
  { path: "/add-notes", icon: PenBox, label: "Add Notes", description: "Create new study notes" },
  { path: "/add-resources", icon: Link2, label: "Add Resources", description: "Upload learning resources" },
  { path: "/add-projects", icon: LucideAward, label: "Add Projects", description: "Showcase new projects" },
  { path: "/add-blogs", icon: Notebook, label: "Add Blogs", description: "Write blog posts" },
];

export function Sidebar() {
  const { state } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (user && user.email) {
      const email = user.email.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <ShadSidebar className="bg-card">
      <SidebarHeader className="bg-opacity-50 bg-black">
        <h2 className="text-2xl sm:text-xl font-bold text-primary p-3">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent className="bg-black/10 space-y-4">
        <SignedIn>
          <SidebarMenu className="space-y-2 p-2">
            {routes.map(({ path, icon: Icon, label }) => (
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
        <SignedIn>
          {isAdmin && (
            <div className="space-y-2 mb-2">
              {/* Consolidated Add Item Dropdown */}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-base font-medium
                      text-foreground hover:text-primary hover:bg-primary/5
                      transition-all duration-200 ease-in-out group"
                  >
                    <div className="flex items-center">
                      <Plus className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                      Add Content
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-background border-border" 
                  align="end" 
                  side="top"
                >
                  <DropdownMenuLabel className="text-muted-foreground">
                    Create Content
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {adminAddItems.map(({ path, icon: Icon, label, description }) => (
                    <DropdownMenuItem key={path} asChild>
                      <Link to={path} className="cursor-pointer">
                        <Icon className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground">{description}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Broadcast Notifications Link */}
              <Link to="/broadcast-notification">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-base font-medium
                    transition-all duration-200 ease-in-out
                    ${isActive("/broadcast-notification") 
                      ? "bg-blue-500/10 text-blue-400 shadow-sm" 
                      : "text-foreground hover:text-blue-400 hover:bg-blue-500/5"
                    }
                  `}
                >
                  <Bell className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  Notifications
                </Button>
              </Link>

              {/* Admin Dashboard Link */}
              <Link to="/admin-dashboard">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-base font-medium
                    transition-all duration-200 ease-in-out
                    ${isActive("/admin-dashboard") 
                      ? "bg-purple-500/10 text-purple-400 shadow-sm" 
                      : "text-foreground hover:text-purple-400 hover:bg-purple-500/5"
                    }
                  `}
                >
                  <Settings className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          )}

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
        </SignedIn>
      </SidebarFooter>
    </ShadSidebar>
  );
}

export default Sidebar;