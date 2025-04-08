
import { Link } from "react-router-dom";
import { Cat, ArrowRight, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-2 rounded-lg">
                <Cat className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">MeowTrade</span>
            </Link>
            <p className="mt-4 text-slate-500 text-sm">
              Professional-grade trading strategies with algorithmic precision. Simplified for everyone.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Trading</h3>
            <ul className="space-y-3">
              <li><Link to="/strategies" className="text-slate-500 hover:text-meow-paw text-sm">Strategies</Link></li>
              <li><Link to="/app" className="text-slate-500 hover:text-meow-paw text-sm">Launch App</Link></li>
              <li><Link to="/mocktrading" className="text-slate-500 hover:text-meow-paw text-sm">Mock Trading</Link></li>
              <li><Link to="/pricing" className="text-slate-500 hover:text-meow-paw text-sm">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-500 hover:text-meow-paw text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-meow-paw text-sm">Contact Us</Link></li>
              <li><Link to="/careers" className="text-slate-500 hover:text-meow-paw text-sm">Careers</Link></li>
              <li><Link to="/blog" className="text-slate-500 hover:text-meow-paw text-sm">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-500 mb-3">Subscribe to our newsletter for the latest updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-l-lg px-3 py-2 border border-slate-200 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-meow-paw"
              />
              <button className="bg-gradient-to-r from-meow-paw to-meow-tabby text-white rounded-r-lg p-2">
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="mt-4">
              <Link to="/terms" className="text-xs text-slate-500 hover:text-meow-paw mr-4">Terms</Link>
              <Link to="/privacy" className="text-xs text-slate-500 hover:text-meow-paw">Privacy</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} MeowTrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
