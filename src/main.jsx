import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from "lenis/react";
import { AuthProvider } from '@/contexts/AuthContext.jsx';

// ✅ Initialized TanStack React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactLenis root/>
        <App />
        <Analytics />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
