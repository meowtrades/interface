
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LineChart, 
  CircleDollarSign, 
  Wallet, 
  Settings, 
  LogOut,
  Menu,
  X,
  Cat,
  Bell,
  User
} from 'lucide-react';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const userJson = localStorage.getItem('cryptoclick_user');
    if (!userJson) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userJson);
      if (!userData.authenticated) {
        navigate('/login');
        return;
      }
      setUser(userData);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cryptoclick_user');
    navigate('/');
  };

  if (!user) return null;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
    { icon: <LineChart size={20} />, label: 'Strategies', path: '/app/strategies' },
    { icon: <CircleDollarSign size={20} />, label: 'Mock Trades', path: '/app/mock-trades' },
    { icon: <Wallet size={20} />, label: 'Wallet', path: '/app/wallet' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-2 rounded-lg">
              <Cat className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MeowTrade</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path ? 
                    'bg-meow-siamese/10 text-meow-paw font-medium' : 
                    'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <LogOut size={20} className="mr-3" />
            Log out
          </Button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Search or Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-medium text-slate-800">
              {location.pathname.includes('dashboard') && 'Dashboard'}
              {location.pathname.includes('strategies') && 'Trading Strategies'}
              {location.pathname.includes('mock-trades') && 'Mock Trading'}
              {location.pathname.includes('wallet') && 'Wallet'}
              {location.pathname.includes('settings') && 'Settings'}
            </h1>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-600 hover:bg-slate-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-meow-paw rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-meow-siamese/30 flex items-center justify-center text-meow-paw">
                <User size={18} />
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700">
                {user?.name || 'User'}
              </span>
            </div>
          </div>
        </header>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-2 rounded-lg">
                  <Cat className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">MeowTrade</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path ? 
                        'bg-meow-siamese/10 text-meow-paw font-medium' : 
                        'text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <LogOut size={20} className="mr-3" />
                  Log out
                </Button>
              </div>
            </nav>
          </div>
        )}
        
        {/* Page Content */}
        <main className="flex-1 p-6 bg-slate-50 overflow-auto">
          <div className="premium-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
