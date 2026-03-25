import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', gender: '',
    dateOfBirth: '', religion: '', motherTongue: '',
    profession: '', annualIncome: '', height: '', diet: 'Veg',
  });
const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else { setError(data.msg || 'Google Sign-In failed'); }
    } catch (err) { setError('Unable to connect to server'); } finally { setLoading(false); }
  };
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      
      // Limit to 6 photos total
      if (images.length + fileList.length > 6) {
        setError("You can only upload a maximum of 6 photos.");
        return;
      }

      const newImages = [...images, ...fileList];
      setImages(newImages);

      // Create URL previews
      const newPreviews = fileList.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      setError('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // 1. Prepare data
  const dataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
  images.forEach((file) => dataToSend.append('photos', file));

  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
  
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      /* 
         CRITICAL FIX: 
         - For Login: Send JSON + Headers
         - For Register: Send FormData + NO HEADERS (Browser sets it for you)
      */
      headers: isLogin ? { 'Content-Type': 'application/json' } : {},
      body: isLogin ? JSON.stringify(formData) : dataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/');
    } else {
      setError(data.msg || 'Authentication failed');
    }
  } catch (err) {
    setError('Unable to connect to server');
  } finally {
    setLoading(false);
  }

};
  return (
    /* 
       MOBILE: min-h-screen and py-4 (allows scrolling)
       DESKTOP: h-[calc(100vh-80px)] and overflow-hidden (fixed no-scroll)
    */
     <div className="min-h-screen lg:h-auto 2xl:h-[calc(100vh-160px)] bg-rose-50 flex items-center justify-center p-3 sm:p-6 font-inter transition-all">
      <div className={`bg-white w-full shadow-2xl overflow-hidden border border-rose-100 transition-all duration-500 flex flex-col
        ${isLogin 
          ? 'max-w-[400px] sm:max-w-md 2xl:max-w-2xl rounded-3xl 2xl:rounded-[3rem]' 
          : 'max-w-[95%] lg:max-w-5xl 2xl:max-w-7xl rounded-3xl 2xl:rounded-[4rem]'
        }`}>
        
        <div className="bg-rose-500 py-6 md:py-8 2xl:py-12 text-center text-white shrink-0">
          <h2 className="text-3xl md:text-4xl 2xl:text-7xl font-bold font-k2d tracking-tight">Wedlink</h2>
          <p className="text-rose-100 text-sm md:text-base 2xl:text-2xl font-light italic opacity-90 px-4">
            {isLogin ? "Welcome back" : "Create your matrimonial profile"}
          </p>
        </div>

        <div className="p-5 sm:p-8 2xl:p-14 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className={`grid gap-6 ${isLogin ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              
              {/* Form Fields Column */}
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
                      <div className="flex flex-col"><label className="auth-label">Religion</label>
                        <input type="text" name="religion" required className="auth-input" onChange={handleChange} placeholder="e.g. Hindu" />
                      </div>
                      <div className="flex flex-col"><label className="auth-label">Mother Tongue</label>
                        <input type="text" name="motherTongue" required className="auth-input" onChange={handleChange} placeholder="e.g. Malayalam" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Photo Upload Column (Only for Registration) */}
              {!isLogin && (
                <div className="space-y-4">
                  <label className="auth-label">Profile Photos (Max 6)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Render previews and empty slots */}
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="relative aspect-square rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 flex items-center justify-center overflow-hidden group">
                        {previews[index] ? (
                          <>
                            <img src={previews[index]} className="w-full h-full object-cover" alt={`Upload ${index}`} />
                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center">
                            <svg className="w-6 h-6 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={images.length >= 6} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 italic">Recommended: Clear face photos increase match chances by 80%.</p>
                </div>
              )}
            </div>

            {error && <p className="text-red-500 bg-red-50 py-2 rounded-xl text-center text-sm font-medium">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-rose-500 text-white font-bold py-4 2xl:py-7 rounded-2xl shadow-lg hover:bg-rose-600 transition-all 2xl:text-3xl active:scale-[0.98]">
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Register Now")}
            </button>

            {/* Google Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="px-3 text-gray-400 text-[10px] font-bold">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed')} theme="outline" shape="pill" />
            </div>

            <div className="text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-rose-600 font-bold text-sm hover:underline">
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