
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Auth from '@/components/Auth';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Welcome to <span className="gradient-text">CryptoClick</span>
            </h1>
            <p className="text-slate-600 mb-4">
              Sign in to access your dashboard and start your one-click trading journey.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Access your trading strategies",
                "Check your portfolio performance",
                "Start and monitor mock trades",
                "Launch one-click trading bots"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-crypto-green flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center items-center">
            <Auth />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
