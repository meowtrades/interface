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
    return user ? "Go to Dashboard" : "Launch App";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-white shadow-sm border-b border-slate-100">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Meowtrades Logo" className="w-[200px]" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-3">
            <Link href={getAppLink()}>
              <Button
                size="lg"
                className="text-md bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white rounded-lg"
                disabled={isPending}
              >
                {getAppText()}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white shadow-lg border-t border-slate-100 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link
              href={getAppLink()}
              className={`px-4 py-2 bg-gradient-to-r from-meow-paw to-meow-tabby text-white rounded-md text-center font-medium ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {getAppText()}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
