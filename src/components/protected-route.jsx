import { useUser } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ADMIN_EMAILS } from "@/config/admin";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  if (isLoaded && !isSignedIn && isSignedIn !== undefined){
      return <Navigate to="/"/>
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
