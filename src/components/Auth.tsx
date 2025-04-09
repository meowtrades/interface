
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

type AuthProps = {
  onSuccess?: () => void;
};

const Auth = ({ onSuccess }: AuthProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // This is a mock authentication function
  // In a real app, this would connect to Google Auth
  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // Mock auth delay
    setTimeout(() => {
      // Store a mock user token
      localStorage.setItem('cryptoclick_user', JSON.stringify({
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        walletAddress: '0x123...abc',
        authenticated: true
      }));
      
      setIsLoading(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/app/dashboard');
      }
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center">
      <Button 
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            className="fill-[#4285F4]"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            className="fill-[#34A853]"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            className="fill-[#FBBC05]"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            className="fill-[#EA4335]"
          />
        </svg>
        <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
      </Button>
      
      <p className="text-xs text-slate-400 mt-4 text-center">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
};

export default Auth;
