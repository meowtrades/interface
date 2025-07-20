"use client";

/** @format */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders component that wraps global providers
 * This now only includes providers that should be available everywhere
 * StrategiesProvider is now scoped to authenticated routes in AppLayout
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
