
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-purple flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold gradient-text">CryptoClick</span>
            </Link>
            <p className="mt-4 text-slate-600 text-sm">
              Simplifying crypto trading with one-click strategies. Grow your wealth without the complexity.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Trading</h3>
            <ul className="space-y-2">
              <li><Link to="/strategies" className="text-slate-600 hover:text-crypto-blue text-sm">Strategies</Link></li>
              <li><Link to="/app" className="text-slate-600 hover:text-crypto-blue text-sm">Launch App</Link></li>
              <li><Link to="/mocktrading" className="text-slate-600 hover:text-crypto-blue text-sm">Mock Trading</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 hover:text-crypto-blue text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-crypto-blue text-sm">Contact Us</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-crypto-blue text-sm">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-slate-600 hover:text-crypto-blue text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-crypto-blue text-sm">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-slate-600 hover:text-crypto-blue text-sm">Risk Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-200/50">
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} CryptoClick. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
