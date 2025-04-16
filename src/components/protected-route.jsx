import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ADMIN_EMAILS } from "@/config/admin";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const isSignedIn = !!user;
  const isAdmin = user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress);

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
