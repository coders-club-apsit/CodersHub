import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AppLayout from './layout/app-layout';
import LandingPage from './pages/landingpage';
import AboutUs from './pages/aboutus';
import { ThemeProvider } from './components/theme-provider';
import Notes from './pages/notes';
import ProtectedRoute from './components/protected-route';
import AddNotes from './pages/add-notes';
import SavedNotes from './pages/saved-notes';
import SavedResources from './pages/saved-resources';
import AddResoures from './pages/add-resources';
import Resources from './pages/resources';
import Note from './pages/note';
import NotePage from './pages/note';
import AccessDenied from './pages/access-denied';
import { ToastContainer } from 'react-toastify';
import NotesListing from './pages/notes';
import EditNotes from './pages/editnotes';
import ResourcesPage from './pages/resource';
import { useState, useEffect, useCallback, useMemo } from "react";
import EditResources from './pages/editresources';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';

const App = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handlePrivacyPolicyClose = useCallback(() => {
    setShowPrivacyPolicy(false);
  }, []);

  const handlePrivacyPolicyOpen = useCallback(() => {
    setTimeout(() => setShowPrivacyPolicy(true), 0);
  }, []);

  // Memorize the router configuration to prevent re-renders
  const router = useMemo(() => createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
        },
      ],
    },  
        {
          path: '/access-denied',
          element: <AccessDenied />,
        },
        {
          path: '/note/edit/:noteId',
          element: <EditNotes />,
        },
        {
          path: '/about-us',
          element: (
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          ),
        },
        {
          path: '/notes',
          element: (
            <ProtectedRoute>
              <NotesListing />
            </ProtectedRoute>
          ),
        },
        {
          path: '/note/:id',
          element: (
            <ProtectedRoute>
              <NotePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/resources',
          element: (
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          ),
        },
        {
          path: '/resource/:id',
          element: (
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/resource/edit/:resourceId',
          element: <EditResources />,
        },
        {
          path: '/add-notes',
          element: (
            <ProtectedRoute>
              <AddNotes />
            </ProtectedRoute>
          ),
        },
        {
          path: '/add-resources',
          element: (
            <ProtectedRoute>
              <AddResoures />
            </ProtectedRoute>
          ),
        },
        {
          path: '/saved-notes',
          element: (
            <ProtectedRoute>
              <SavedNotes />
            </ProtectedRoute>
          ),
        },
        {
          path: '/saved-resources',
          element: <SavedResources />,
        },
        {
          path: '/privacy-policy',
          loader: () => {
            handlePrivacyPolicyOpen();
            return null;
          },
          element: null,
        },
      
  ]), [handlePrivacyPolicyOpen]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <PrivacyPolicyModal 
        open={showPrivacyPolicy} 
        onOpenChange={handlePrivacyPolicyClose} 
      />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
