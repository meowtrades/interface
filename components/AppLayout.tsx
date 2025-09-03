"use client";

/** @format */

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  CircleDollarSign,
  LogOut,
  Menu,
  X,
  User,
  Grid,
  Trophy,
} from "lucide-react";
import { authClient } from "@/lib/auth";
import { StrategiesProvider } from "@/lib/context/StrategiesContext";
import { WalletProvider } from "@/lib/context/WalletContext";
import { cn } from "@/lib/design-system";
import { useCurrentUserXp } from "@/api/hooks/useUserHooks";
import ConnectWalletButton from "@/components/ConnectWalletButton";

type AppLayoutProps = {
  children: React.ReactNode;
};
const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: userXp, isLoading: isXpLoading } = useCurrentUserXp();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (!user) return null;

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/app/dashboard",
    },
    {
      icon: <LineChart size={20} />,
      label: "Live Strategies",
      path: "/app/strategies",
    },
    {
      icon: <CircleDollarSign size={20} />,
      label: "Paper Trades",
      path: "/app/paper-trades",
    },
    // {
    //   icon: <Grid size={20} />,
    //   label: "Grid Visualization",
    //   path: "/app/grid-visualization",
    // },
    {
      icon: <Trophy size={20} />,
      label: "Leaderboard",
      path: "/app/leaderboard",
    },
  ];

  const getPageTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("strategies")) return "Trading Strategies";
    if (pathname.includes("paper-trades")) return "Paper Trades";
    if (pathname.includes("grid-visualization")) return "Grid Visualization";
    if (pathname.includes("leaderboard")) return "Leaderboard";
    return "Dashboard";
  };

  const getSubtitle = () => {
    if (pathname.includes("dashboard"))
      return "Welcome back! Here's your trading overview.";
    if (pathname.includes("strategies"))
      return "Explore and launch one-click trading strategies.";
    if (pathname.includes("paper-trades")) return "Paper Trades";
    if (pathname.includes("grid-visualization")) return "Grid Visualization";
    if (pathname.includes("leaderboard")) return "Leaderboard";
  };

  return (
    <StrategiesProvider>
      <WalletProvider>
        <div
          className={cn(
            "min-h-screen bg-background relative",
            pathname.includes("leaderboard") &&
              "bg-gradient-to-br from-background via-muted to-background"
          )}
        >
          {/* Desktop Sidebar - Fixed positioned */}
          <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-50">
            <div className="h-[88px] px-6 py-6 border-b border-border bg-card flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Meowtrades Logo"
                  className="w-[200px]"
                />
              </Link>
            </div>

            <nav className="flex-1 py-6 px-4 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-body font-medium",
                        pathname === item.path
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-border flex-shrink-0">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted py-3 px-4 h-auto"
              >
                <LogOut size={18} className="mr-3" />
                Log out
              </Button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col lg:ml-64">
            {/* Top Header Bar */}
            <header className="h-[88px] bg-card border-b border-border px-6 py-6 flex items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              {/* Page Title */}
              <div className="hidden md:block">
                <h1 className="text-title font-semibold text-foreground">
                  {getPageTitle()}
                </h1>
                {/* <p className="text-body font-medium text-muted-foreground">
                  {getSubtitle()}
                </p> */}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                <ConnectWalletButton />
                <div className="flex items-center gap-4">
                  <Link
                    href="/paws-program"
                    target="_blank"
                    className="text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
                    title="Click to learn how to earn more PawScore"
                  >
                    <Trophy size={20} />
                    <span className="font-semibold">
                      {isXpLoading
                        ? "Loading..."
                        : `${userXp?.toLocaleString() || 0} XP`}
                    </span>
                    {/* <Info size={16} className="opacity-70" /> */}
                  </Link>
                  

                </div>
                {/* <button className="p-2.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground relative">
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full"></span>
                                </button> */}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="hidden md:block text-body font-medium text-foreground">
                    {user?.name || "User"}
                  </span>
                </div>
              </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-card">
                <div className="flex justify-between items-center p-6 border-b border-border">
                  <Link href="/" className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Meowtrades Logo"
                      className="w-[200px]"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="p-4">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-body font-medium",
                            pathname === item.path
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <ConnectWalletButton variant="outline" className="w-full justify-start py-4 px-4 h-auto" />

                  <div className="mt-8 pt-6 border-t border-border">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted py-4 px-4 h-auto"
                    >
                      <LogOut size={20} className="mr-4" />
                      Log out
                    </Button>
                  </div>
                </nav>
              </div>
            )}

            {/* Page Content */}
            <main
              className={cn(
                "flex-1 bg-background",
                !pathname.includes("leaderboard") ? "p-6 md:p-8" : ""
              )}
            >
              <div
                className={cn(
                  !pathname.includes("leaderboard") ? "max-w-7xl mx-auto" : "",
                  "overflow-y-auto"
                )}
              >
                {children}
              </div>
            </main>
          </div>
        </div>
      </WalletProvider>
    </StrategiesProvider>
  );
};

export default AppLayout;
