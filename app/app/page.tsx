"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";

export default function AppPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (!isPending) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.replace("/app/dashboard");
      } else {
        // User is not authenticated, redirect to login
        router.replace("/login");
      }
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
} 