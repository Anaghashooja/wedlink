import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUser(data);
      else navigate('/auth');
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // 1. ADDED: Handle Privacy Toggle Logic
  const handleTogglePrivacy = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/auth/privacy', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state to show the toggle moving
        setUser({ ...user, photoPrivacy: data.photoPrivacy });
      }
    } catch (err) {
      alert("Error updating privacy settings");
    }
  };

  const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setVerifying(true);
    const formData = new FormData();
    formData.append('photos', e.target.files[0]);

    try {
      const res = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (res.ok) {
        alert("Verification document uploaded! Our team will review it.");
        fetchProfile();
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="text-center py-20 3xl:text-6xl text-rose-500 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fff8f4] font-inter pb-20">
      {/* Profile Header */}
      <div className="relative h-64 md:h-80 3xl:h-[600px] bg-gradient-to-r from-[#6f2434] to-[#8d3b4a]">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
          <div className="relative">
            <img 
              src={user?.photos?.[0] || `https://ui-avatars.com/api/?name=${user?.name}&size=512`} 
              className="w-32 h-32 md:w-48 md:h-48 3xl:w-80 3xl:h-80 rounded-full border-4 border-white shadow-xl object-cover bg-white"
              alt="Profile"
            />
            {user?.isVerified && (
              <div className="absolute bottom-2 right-2 bg-[#775a19] text-white p-2 3xl:p-4 rounded-full shadow-lg ring-4 ring-white flex items-center justify-center">
                <span className="material-symbols-outlined text-sm md:text-xl 3xl:text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl 3xl:max-w-[2200px] mx-auto mt-20 px-4 md:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8 3xl:gap-16">
        
        <div className="lg:col-span-2 space-y-6 3xl:space-y-12">
          {/* Main Details Card */}
          <div className="bg-white p-8 3xl:p-16 rounded-[2rem] 3xl:rounded-[3rem] shadow-sm border border-rose-50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl 3xl:text-8xl font-bold text-gray-800 font-headline italic">{user?.name}</h1>
                    {user?.isVerified && <span className="text-[#775a19] font-bold text-xs 3xl:text-3xl uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">Verified</span>}
                </div>
                <p className="text-rose-500 font-semibold 3xl:text-4xl mt-2 uppercase tracking-tighter">{user?.profession || 'Member'}</p>
              </div>
              <button className="bg-rose-50 text-rose-600 px-6 py-2 3xl:px-12 3xl:py-6 3xl:text-3xl rounded-xl font-bold hover:bg-rose-500 hover:text-white transition">Edit</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 3xl:gap-16 border-t pt-8">
              <DetailItem label="Email Address" value={user?.email} />
              <DetailItem label="Community" value={user?.religion || 'Not Specified'} />
              <DetailItem label="Gender" value={user?.gender} />
              <DetailItem label="Joined On" value={new Date(user?.date).toLocaleDateString()} />
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white p-8 3xl:p-16 rounded-[2rem] 3xl:rounded-[3rem] border border-rose-100 shadow-lg relative overflow-hidden">
             {user?.isVerified ? (
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 3xl:w-32 3xl:h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-4xl 3xl:text-7xl">gpp_good</span>
                    </div>
                    <div className="z-10">
                        <h3 className="text-xl 3xl:text-5xl font-bold text-gray-800">Identity Verified</h3>
                        <p className="text-gray-500 3xl:text-3xl">Trusted badge active on your profile.</p>
                    </div>
                </div>
             ) : (
                <div className="space-y-6">
                    <h3 className="text-2xl 3xl:text-6xl font-bold text-gray-800 font-headline italic">Identity Trust Score</h3>
                    <p className="text-gray-600 3xl:text-3xl">Verified profiles get <span className="text-rose-600 font-bold">3x more attention</span>.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex-grow cursor-pointer flex items-center justify-center gap-3 py-4 bg-rose-900 text-white rounded-2xl font-bold 3xl:text-4xl">
                            <span className="material-symbols-outlined">badge</span>
                            {verifying ? 'Uploading...' : 'Upload Gov. ID'}
                            <input type="file" className="hidden" onChange={handleVerificationUpload} />
                        </label>
                    </div>
                </div>
             )}
          </div>

          {/* 2. ADDED: Photo Privacy Card (Integrated correctly) */}
          <div className="bg-white p-8 3xl:p-16 rounded-[2rem] 3xl:rounded-[3rem] border border-rose-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 3xl:w-24 3xl:h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <span className="material-symbols-outlined 3xl:text-5xl">lock</span>
                </div>
                <div>
                  <h3 className="text-xl 3xl:text-5xl font-bold text-gray-800">Photo Privacy</h3>
                  <p className="text-gray-500 3xl:text-3xl">Blur photos for non-connected users</p>
                </div>
              </div>
              
              {/* TOGGLE SWITCH */}
              <button 
                onClick={handleTogglePrivacy}
                className={`w-14 h-7 3xl:w-28 3xl:h-14 rounded-full relative transition-all duration-300 ${user?.photoPrivacy ? 'bg-rose-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-5 h-5 3xl:w-10 3xl:h-10 bg-white rounded-full transition-all duration-300 ${user?.photoPrivacy ? 'left-8 3xl:left-16' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 3xl:p-12 rounded-[2rem] shadow-sm border border-rose-50">
            <h3 className="text-xl 3xl:text-4xl font-bold text-gray-800 mb-6 font-headline">Gallery ({user?.photos?.length || 0}/6)</h3>
            <div className="grid grid-cols-3 gap-3 3xl:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-rose-50 rounded-xl border-2 border-dashed border-rose-100 flex items-center justify-center overflow-hidden">
                  {user?.photos?.[i] ? <img src={user.photos[i]} className="w-full h-full object-cover" alt="gallery" /> : <span className="text-rose-200 text-2xl">+</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-gray-400 text-[10px] 3xl:text-2xl font-bold uppercase tracking-widest">{label}</p>
    <p className="text-gray-800 font-semibold md:text-lg 3xl:text-4xl">{value}</p>
  </div>
);

export default Profile;