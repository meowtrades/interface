/** @format */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  CircleDollarSign,
  Wallet,
  LogOut,
  Menu,
  X,
  Cat,
  Bell,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth";

type AppLayoutProps = {
  children: React.ReactNode;
};

type UserData = {
  authenticated: boolean;
  name?: string;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
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
      path: "/app/mock-trades",
    },
    { icon: <Wallet size={20} />, label: "Wallet", path: "/app/wallet" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex max-w-screen">
      {/* Desktop Sidebar - Increased width from w-56 to w-72 */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 bg-white">
        <div className="p-2 border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Meowtrades Logo" className="w-[200px]" />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-2.5">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-meow-siamese/10 text-meow-paw font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.icon}
                  <span className="text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-5 border-t border-slate-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-3 px-4 h-auto"
          >
            <LogOut size={18} className="mr-3" />
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-600 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Search or Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-medium text-slate-800">
              {location.pathname.includes("dashboard") && "Dashboard"}
              {location.pathname.includes("strategies") && "Trading Strategies"}
              {location.pathname.includes("mock-trades") && "Mock Trading"}
              {location.pathname.includes("wallet") && "Wallet"}
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5">
            <button className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 relative">
              <Bell size={20} />
              {/* <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-meow-paw rounded-full"></span> */}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-meow-siamese/30 flex items-center justify-center text-meow-paw">
                <User size={18} />
              </div>
              <span className="hidden md:block text-base font-medium text-slate-700">
                {user?.name || "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="flex justify-between items-center p-2 border-b border-slate-200">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Meowtrades Logo"
                  className="w-[200px]"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="p-2">
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-5 py-4 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-meow-siamese/10 text-meow-paw font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-4 px-5 h-auto"
                >
                  <LogOut size={20} className="mr-4" />
                  Log out
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Page Content - Increased horizontal padding and added max-width for better content width */}
        <main className="flex-1 p-2 pt-4 md:p-10 bg-slate-50 overflow-auto">
          <div className="premium-container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
