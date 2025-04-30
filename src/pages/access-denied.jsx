import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          Sorry, you don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;