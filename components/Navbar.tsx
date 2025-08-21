/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  // Determine where to redirect based on authentication status
  const getAppLink = () => {
    if (isPending) return "#"; // Don't navigate while loading
    return user ? "/app/dashboard" : "/login";
  };

  const getAppText = () => {
    if (isPending) return "Loading...";
    return user ? "Dashboard" : "Launch App";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg"></div>

      <div className="container mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2 hover-lift transition-all duration-300"
        >
          <img
            src="/logo.png"
            alt="Meowtrades Logo"
            className="w-[180px] h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <Link href={getAppLink()}>
            <Button
              size="sm"
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-5 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift font-medium"
              disabled={isPending}
            >
              {isPending ? "Loading..." : getAppText()}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/80 transition-all duration-200 hover-lift shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/20 animate-fade-in overflow-hidden">
          <div className="p-6">
            <Link href={getAppLink()} onClick={() => setIsOpen(false)}>
              <Button
                className="w-full group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 shadow-lg transition-all duration-300 font-medium"
                disabled={isPending}
              >
                {isPending ? "Loading..." : getAppText()}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
