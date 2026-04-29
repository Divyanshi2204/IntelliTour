import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * OAuthCallbackPage
 *
 * The backend redirects here after a successful Google OAuth flow:
 *   /auth/callback?token=<JWT>
 *
 * This page reads the token, fetches the user profile, stores both in
 * localStorage, updates AuthContext state, then navigates to /dashboard.
 */
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (oauthError || !token) {
      setError('Google sign-in failed. Please try again.');
      return;
    }

    loginWithToken(token)
      .then(() => {
        toast.success('Signed in with Google! 🎉');
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setError('Could not retrieve your profile. Please try again.');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-sm w-full text-center">
          <div className="flex justify-center mb-4 text-red-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign-in Failed</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full py-2.5 px-4 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-brand-600 animate-spin" />
        <p className="text-slate-600 font-medium">Completing sign-in…</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
