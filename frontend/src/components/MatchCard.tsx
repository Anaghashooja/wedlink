import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useState } from 'react';

interface UserProfile {
  _id: string;
  name: string;
  profession?: string;
  religion?: string;
  age?: number;
  photos?: string[];
   location?: string;
  motherTongue?: string;
  photoPrivacy?: boolean;
  connectionStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
}

interface MatchCardProps {
  user: UserProfile;
}

export const MatchCard: React.FC<MatchCardProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(user.connectionStatus === 'pending');

  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login first");


    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/send/${user._id}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
      });
      if (res.ok) setIsSent(true);
      else {
          const data = await res.json();
          alert(data.msg || "Error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
const shouldBlur = user.photoPrivacy === true && user.connectionStatus !== 'accepted'; 
  return (
    <div className="group bg-white rounded-[2rem] 3xl:rounded-[3.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-rose-50 flex flex-col h-full">
      
      {/* PHOTO SECTION */}
      <div className="relative h-[380px] 3xl:h-[600px] overflow-hidden">
        <Link to={`/profile/${user._id}`}>
          <div className="relative overflow-hidden">
          <img
            src={user.photos?.[0]}
            className={`w-full h-full object-cover transition-all duration-700 
              ${shouldBlur ? 'blur-2xl scale-110 grayscale' : 'group-hover:scale-105'}`} 
          />
          
          {/* PRIVACY OVERLAY */}
          {shouldBlur && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
               <span className="material-symbols-outlined text-white text-4xl 3xl:text-8xl mb-2">lock</span>
               <p className="text-white text-[10px] 3xl:text-2xl font-bold uppercase tracking-widest text-center px-4">
                 Photo visible only to <br/> Accepted Connections
               </p>
            </div>
          )}
        </div>
      </Link>
        
        {/* Verification Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 3xl:px-6 3xl:py-3 rounded-full flex items-center gap-1 shadow-sm border border-rose-100">
          <span className="text-green-500 text-xs 3xl:text-xl">✔</span>
          <span className="text-gray-700 font-bold text-[10px] 3xl:text-lg uppercase tracking-wider">Verified</span>
        </div>

        {/* User Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 3xl:p-12">
            <h3 className="text-white text-2xl 3xl:text-6xl font-bold">{user.name}, {user.age || '26'}</h3>
            <p className="text-rose-100 text-sm 3xl:text-3xl font-medium mt-1">{user.location || 'India'}</p>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-6 3xl:p-14 space-y-4 3xl:space-y-8 flex-grow">
        <div className="grid grid-cols-2 gap-y-2 3xl:gap-y-6 text-sm 3xl:text-3xl">
          <div className="text-gray-400 font-medium">Religion</div>
          <div className="text-gray-700 font-semibold text-right">{user.religion || 'Community'}</div>
          
          <div className="text-gray-400 font-medium">Profession</div>
          <div className="text-gray-700 font-semibold text-right truncate pl-2">{user.profession || 'Professional'}</div>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 3xl:pt-10 flex gap-3 3xl:gap-6 mt-auto">
          <button
            onClick={handleConnect}
            disabled={isSent || loading}
            className={`flex-grow font-bold py-3.5 3xl:py-8 rounded-xl 3xl:rounded-[2rem] transition-all 3xl:text-4xl active:scale-95 shadow-md ${
              isSent 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            {loading ? "..." : isSent ? "Request Sent" : "Connect Now"}
          </button>
          
          <button className="px-4 3xl:px-8 bg-rose-50 text-rose-500 rounded-xl 3xl:rounded-[2rem] border border-rose-100 hover:bg-rose-100 transition active:scale-90">
             <span className="material-symbols-outlined 3xl:text-5xl">favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
};