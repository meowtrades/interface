"use client";

/** @format */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { InjectiveWalletProvider } from "@/lib/context/InjectiveWalletContext";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders component that wraps global providers
 * This now includes InjectiveWalletProvider for unified wallet management
 * StrategiesProvider is scoped to authenticated routes in AppLayout
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <InjectiveWalletProvider enableAutoReconnect={true}>
        <TooltipProvider>{children}</TooltipProvider>
      </InjectiveWalletProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
