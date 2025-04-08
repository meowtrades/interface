import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Menu, X, Cat } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-meow-cream/80 backdrop-blur-lg shadow-sm border-b border-meow-paw/20">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Cat className="w-10 h-10 text-meow-paw" />
          <span className="text-2xl font-bold gradient-text">MeowTrade</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/" className="text-meow-midnight hover:text-meow-siamese font-medium transition-colors">Home</Link>
            <Link to="/strategies" className="text-meow-midnight hover:text-meow-siamese font-medium transition-colors">Strategies</Link>
            <Link to="/about" className="text-meow-midnight hover:text-meow-siamese font-medium transition-colors">About</Link>
          </div>
          <div className="flex gap-3">
            <Link to="/app">
              <Button variant="default" size="sm" className="bg-meow-paw hover:bg-meow-tabby">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md text-meow-midnight" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-meow-cream shadow-lg border-t border-meow-paw/20 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-md text-meow-midnight hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/strategies" 
              className="px-4 py-2 rounded-md text-meow-midnight hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Strategies
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 rounded-md text-meow-midnight hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/app" 
              className="px-4 py-2 bg-meow-paw text-white rounded-md text-center font-medium"
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
