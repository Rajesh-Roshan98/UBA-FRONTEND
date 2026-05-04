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

      <main
        role="main"
        className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6"
      >
        <div className="max-w-md w-full text-center flex flex-col items-center animate-in fade-in duration-200">
          
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <ErrorIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>

          <h1
            ref={headingRef}
            tabIndex={-1} 
            className="text-2xl sm:text-3xl font-semibold text-gray-900 outline-none mb-3"
          >
            {title}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {needsVerification && activeCode === 403 && (
              <button 
                onClick={handleVerifyClick} 
                disabled={isSending}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {isSending ? <Loader className="animate-spin" size={16} /> : <ShieldAlert size={16} />}
                {isSending ? 'Sending...' : 'Verify Email'}
              </button>
            )}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 w-full">
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