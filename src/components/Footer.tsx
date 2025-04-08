
import { Link } from "react-router-dom";
import { Cat, PawPrint } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-meow-paw to-meow-tabby p-2 rounded-xl">
                <Cat className="w-8 h-8 text-meow-whisker" />
              </div>
              <span className="text-2xl font-bold gradient-text">MeowTrade</span>
            </Link>
            <p className="mt-4 text-slate-600 text-sm">
              Simplifying crypto trading with feline precision. Grow your wealth without the complexity.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Trading</h3>
            <ul className="space-y-2">
              <li><Link to="/strategies" className="text-slate-600 hover:text-meow-paw text-sm">Strategies</Link></li>
              <li><Link to="/app" className="text-slate-600 hover:text-meow-paw text-sm">Launch App</Link></li>
              <li><Link to="/mocktrading" className="text-slate-600 hover:text-meow-paw text-sm">Mock Trading</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 hover:text-meow-paw text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-meow-paw text-sm">Contact Us</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-meow-paw text-sm">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-slate-600 hover:text-meow-paw text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-meow-paw text-sm">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-slate-600 hover:text-meow-paw text-sm">Risk Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-200/50">
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} MeowTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
