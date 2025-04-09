
import { Link } from "react-router-dom";
import { Cat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-1.5 rounded-lg">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Meowtrade</span>
            </Link>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Meowtrade. All rights reserved.
            </p>
            <div className="mt-1 text-xs">
              <Link to="/terms" className="text-slate-400 hover:text-meow-paw mr-4">Terms</Link>
              <Link to="/privacy" className="text-slate-400 hover:text-meow-paw">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
