
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-purple flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold gradient-text">CryptoClick</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/" className="text-slate-600 hover:text-crypto-blue font-medium transition-colors">Home</Link>
            <Link to="/strategies" className="text-slate-600 hover:text-crypto-blue font-medium transition-colors">Strategies</Link>
            <Link to="/about" className="text-slate-600 hover:text-crypto-blue font-medium transition-colors">About</Link>
          </div>
          <div className="flex gap-3">
            <Link to="/app">
              <Button variant="default" size="sm" className="bg-crypto-blue hover:bg-crypto-blue/90">
                Launch App
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
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white shadow-lg border-t border-slate-200/50 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/strategies" 
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Strategies
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/app" 
              className="px-4 py-2 bg-crypto-blue text-white rounded-md text-center font-medium"
              onClick={() => setIsOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
