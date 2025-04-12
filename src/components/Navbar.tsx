import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Menu, X, Cat } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white shadow-sm border-b border-slate-100">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-2 rounded-lg">
            <Cat className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">Meowtrades</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-3">
            <Link to="/app">
              <Button size="lg" className="text-md bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 text-white rounded-lg">
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
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white shadow-lg border-t border-slate-100 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link 
              to="/app" 
              className="px-4 py-2 bg-gradient-to-r from-meow-paw to-meow-tabby text-white rounded-md text-center font-medium"
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
