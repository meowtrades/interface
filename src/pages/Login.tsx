
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import Auth from '@/components/Auth';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-6">
        <Card className="max-w-md w-full shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Welcome to <span className="gradient-text">CryptoClick</span>
              </h1>
              <p className="text-slate-500 text-sm">
                Sign in to continue to your dashboard
              </p>
            </div>
            <Auth />
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
