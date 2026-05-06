import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { API_BASE_URL } from '../config';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false); // New state for Admin Login
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLogin]);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', gender: '',
    dateOfBirth: '', religion: '', motherTongue: '',
    profession: '', annualIncome: '', height: '', diet: 'Veg',
  });

  const [images] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else { setError(data.msg || 'Google Sign-In failed'); }
    } catch { setError('Unable to connect to server'); } finally { setLoading(false); }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
    images.forEach((file) => dataToSend.append('photos', file));

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: isLogin ? { 'Content-Type': 'application/json' } : {},
        body: isLogin ? JSON.stringify(formData) : dataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        // REDIRECTION LOGIC:
        // If data returns role: 'admin', go to dashboard.
        if (data.user?.role === 'admin' || isAdminMode) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.msg || 'Authentication failed');
      }
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen lg:h-auto 2xl:h-[calc(100vh-160px)] bg-rose-50 flex items-center justify-center p-3 sm:p-6 transition-all">
      <div className={`bg-white w-full shadow-2xl overflow-hidden border border-rose-100 transition-all duration-500 flex flex-col
        ${isLogin 
          ? 'max-w-[400px] sm:max-w-md 2xl:max-w-2xl rounded-3xl 2xl:rounded-[3rem]' 
          : 'max-w-[95%] lg:max-w-5xl 2xl:max-w-7xl rounded-3xl 2xl:rounded-[4rem]'
        }`}>
        
        <div className={`${isAdminMode && isLogin ? 'bg-slate-800' : 'bg-rose-500'} py-6 md:py-8 2xl:py-12 text-center text-white shrink-0 transition-colors duration-300`}>
          <h2 className="text-3xl md:text-4xl 2xl:text-7xl font-bold tracking-tight">Wedlink</h2>
          <p className="text-rose-100 text-sm md:text-base 2xl:text-2xl font-light italic opacity-90 px-4">
            {isLogin ? (isAdminMode ? "Admin Control Panel" : "Welcome back") : "Create your matrimonial profile"}
          </p>
        </div>

        <div ref={scrollRef} className="p-5 sm:p-8 2xl:p-14 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className={`grid gap-6 ${isLogin ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              <div className="space-y-4">
                <div className={`grid gap-4 ${isLogin ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {!isLogin && (
                    <div className="sm:col-span-2">
                      <label className="auth-label">Full Name</label>
                      <input type="text" name="name" required className="auth-input" onChange={handleChange} placeholder="Enter name" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="auth-label">Email Address</label>
                    <input type="email" name="email" required className="auth-input" onChange={handleChange} placeholder="email@example.com" />
                  </div>
                  <div className="flex flex-col">
                    <label className="auth-label">Password</label>
                    <input type="password" name="password" required className="auth-input" onChange={handleChange} placeholder="••••••••" />
                  </div>

                  {/* ADMIN LOGIN TOGGLE - Only shown in Login mode */}
                  {isLogin && (
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="checkbox" 
                        id="adminCheck"
                        className="w-4 h-4 2xl:w-8 2xl:h-8 accent-rose-500 rounded cursor-pointer"
                        checked={isAdminMode}
                        onChange={(e) => setIsAdminMode(e.target.checked)}
                      />
                      <label htmlFor="adminCheck" className="text-sm 2xl:text-2xl font-semibold text-gray-600 cursor-pointer">
                        Login as Admin
                      </label>
                    </div>
                  )}

                  {!isLogin && (
                    <>
                      <div className="flex flex-col"><label className="auth-label">Gender</label>
                        <select name="gender" required className="auth-input px-3" onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="flex flex-col"><label className="auth-label">DOB</label>
                        <input type="date" name="dateOfBirth" required className="auth-input" onChange={handleChange} />
                      </div>
                      {/* ... other registration fields ... */}
                    </>
                  )}
                </div>
              </div>

              {/* Photos Column ... (keep existing code) */}
              {!isLogin && (
                <div className="space-y-4">
                    {/* (Keep your previous image upload grid code here) */}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 bg-red-50 py-2 rounded-xl text-center text-sm font-medium">{error}</p>}

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full ${isAdminMode && isLogin ? 'bg-slate-800 hover:bg-slate-900' : 'bg-rose-500 hover:bg-rose-600'} text-white font-bold py-4 2xl:py-7 rounded-2xl shadow-lg transition-all 2xl:text-3xl active:scale-[0.98]`}
            >
              {loading ? "Processing..." : isLogin ? (isAdminMode ? "Admin Access" : "Sign In") : "Register Now"}
            </button>

            {/* Google Section (Hide if Admin Mode is on) */}
            {!isAdminMode && (
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center w-full"><div className="flex-grow border-t border-gray-100"></div><span className="px-3 text-gray-400 text-[10px] font-bold">OR</span><div className="flex-grow border-t border-gray-100"></div></div>
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed')} theme="outline" shape="pill" />
                </div>
            )}

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setIsAdminMode(false); }} 
                className="text-rose-600 font-bold text-sm hover:underline"
              >
                {isLogin ? "New to Wedlink? Register here" : "Already a member? Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};  

export default Auth;