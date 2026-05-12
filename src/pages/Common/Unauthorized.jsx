import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { Lock, ShieldAlert, Loader } from 'lucide-react'; // 🔥 REMOVED: FileQuestion
import toast from 'react-hot-toast'; 
import api from '../../services/api'; 

const Unauthorized = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const headingRef = useRef(null);

  const { user } = useAuth(); 
  
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const isRefresh = sessionStorage.getItem('unauth_locked');

    if (isRefresh) {
      sessionStorage.removeItem('unauth_locked');
      navigate("/", { replace: true });
    } else {
      sessionStorage.setItem('unauth_locked', 'true');
    }

    return () => {
      sessionStorage.removeItem('unauth_locked');
    };
  }, [navigate]);

  const errorDetails = {
    401: {
      icon: ShieldAlert,
      title: 'Unauthorized',
      description: 'Your session has expired or you are not logged in. Please verify your credentials.',
    },
    403: {
      icon: Lock,
      title: 'Access Denied',
      description: (user && user.isEmailVerified === false) 
        ? 'Your email address has not been verified yet. Please verify your account to gain access.'
        : 'You do not have permission to view this page. If you believe this is an error, please contact your system administrator.',
    }
    // 🔥 REMOVED: 404 error block from here
  };

  // 🔥 FIX: Bulletproof URL parameter extraction for dynamic routing
  const extractCodeFromUrl = () => {
    // 1. Try React Router's native hook
    let extracted = searchParams.get("code");
    
    // 2. Try raw window search (for manual redirects bypassing React Router)
    if (!extracted && typeof window !== 'undefined') {
      extracted = new URLSearchParams(window.location.search).get("code");
    }
    
    // 3. Try Hash Router extraction 
    if (!extracted && typeof window !== 'undefined' && window.location.hash.includes('?')) {
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      extracted = hashParams.get("code");
    }
    
    return parseInt(extracted, 10);
  };

  const parsedCode = extractCodeFromUrl();
  const activeCode = errorDetails[parsedCode] ? parsedCode : 403; 
  const { icon: ErrorIcon, title, description } = errorDetails[activeCode];

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const needsVerification = user && user.isEmailVerified === false;

  const handleVerifyClick = async () => {
    try {
      setIsSending(true);
      await api.post('/api/v1/auth/sendotp', { email: user?.email });
      
      toast.success('Verification code sent to your email!');
      navigate('/verify-email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 🔥 CSS FIX: Added min-h-[100dvh] for perfect mobile browser fitting, scaled paddings */}
      <main
        role="main"
        className="w-full min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-gray-50 p-6 sm:p-8 md:p-12"
      >
        <div className="max-w-md w-full text-center flex flex-col items-center animate-in fade-in duration-200">
          
          {/* 🔥 CSS FIX: Scaled icon container based on screen size */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm mb-6 sm:mb-8">
            <ErrorIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" strokeWidth={1.5} />
          </div>

          {/* 🔥 CSS FIX: Fluid heading sizes */}
          <h1
            ref={headingRef}
            tabIndex={-1} 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 outline-none mb-3 sm:mb-4 leading-tight"
          >
            {title}
          </h1>
          
          {/* 🔥 CSS FIX: Better text widths and line-heights for readability on narrow screens */}
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-8 sm:mb-10 max-w-[16rem] sm:max-w-sm mx-auto leading-relaxed">
            {description}
          </p>

          {/* Container for actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {needsVerification && activeCode === 403 && (
              <button 
                onClick={handleVerifyClick} 
                disabled={isSending}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl sm:rounded-lg text-base sm:text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed sm:min-w-[140px]"
              >
                {isSending ? <Loader className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                {isSending ? 'Sending...' : 'Verify Email'}
              </button>
            )}
          </div>

          {/* 🔥 CSS FIX: Scaled margins */}
          <div className="mt-12 sm:mt-14 pt-6 border-t border-gray-200 w-full">
            <p className="text-xs text-gray-400">
              Error Code: {activeCode}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Unauthorized;