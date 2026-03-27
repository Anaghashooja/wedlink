import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface UserProfile {
  _id: string;
  name: string;
  profession?: string;
  religion?: string;
  age?: number;
  photos?: string[];
  location?: string;
  motherTongue?: string;
}

// SUB-COMPONENT: WEDLINK MATCH CARD
const MatchCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login first");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/requests/send/${user._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-[2rem] 3xl:rounded-[3.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-rose-50 flex flex-col h-full">
      
      {/* PHOTO SECTION */}
      <div className="relative h-[380px] 3xl:h-[600px] overflow-hidden">
        <Link to={`/profile/${user._id}`}>
          <img
            src={user.photos && user.photos.length > 0 
              ? user.photos[0] 
              : `https://ui-avatars.com/api/?name=${user.name}&background=ffe4e6&color=e11d48&size=512`
            }
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Verification Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 3xl:px-6 3xl:py-3 rounded-full flex items-center gap-1 shadow-sm border border-rose-100">
          <span className="text-green-500 text-xs 3xl:text-xl">✔</span>
          <span className="text-gray-700 font-bold text-[10px] 3xl:text-lg uppercase tracking-wider">Verified Profile</span>
        </div>

        {/* User Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 3xl:p-12">
            <h3 className="text-white text-2xl 3xl:text-6xl font-bold">{user.name}, {user.age || '26'}</h3>
            <p className="text-rose-100 text-sm 3xl:text-3xl font-medium mt-1">{user.location || 'Location Not Set'}</p>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-6 3xl:p-14 space-y-4 3xl:space-y-8 flex-grow">
        <div className="grid grid-cols-2 gap-y-2 3xl:gap-y-6 text-sm 3xl:text-3xl">
          <div className="text-gray-400 font-medium">Religion</div>
          <div className="text-gray-700 font-semibold text-right">{user.religion || 'Community'}</div>
          
          <div className="text-gray-400 font-medium">Profession</div>
          <div className="text-gray-700 font-semibold text-right truncate pl-2">{user.profession || 'Professional'}</div>
          
          <div className="text-gray-400 font-medium">Mother Tongue</div>
          <div className="text-gray-700 font-semibold text-right">{user.motherTongue || 'Language'}</div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-4 3xl:pt-10 flex gap-3 3xl:gap-6 mt-auto">
          <button
            onClick={handleConnect}
            disabled={isSent || loading}
            className={`flex-grow font-bold py-3.5 3xl:py-8 rounded-xl 3xl:rounded-[2rem] transition-all 3xl:text-4xl active:scale-95 shadow-md shadow-rose-100 ${
              isSent 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            {loading ? "..." : isSent ? "Request Sent" : "Connect Now"}
          </button>
          
          <button className="px-4 3xl:px-8 bg-rose-50 text-rose-500 rounded-xl 3xl:rounded-[2rem] border border-rose-100 hover:bg-rose-100 transition active:scale-90">
             <span className="material-symbols-outlined 3xl:text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// MAIN PAGE
const Matches: React.FC = () => {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/matches');
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-rose-50">
      <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-rose-600 font-bold 3xl:text-5xl animate-pulse">Finding your perfect match...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-rose-50/30 p-6 md:p-12 3xl:p-24 font-inter">
      <div className="max-w-7xl 3xl:max-w-[2400px] mx-auto">
        
        {/* TITLE SECTION */}
        <div className="mb-12 3xl:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl 3xl:text-8xl font-bold text-gray-800 tracking-tight">
              Recommended <span className="text-rose-600">Matches</span>
            </h1>
            <p className="text-gray-500 text-lg 3xl:text-4xl mt-2">Based on your profile preferences and values.</p>
          </div>
          
          <div className="flex gap-4">
             <button className="bg-white border border-gray-200 px-6 py-2 3xl:px-12 3xl:py-5 rounded-full text-gray-600 font-bold 3xl:text-3xl shadow-sm hover:bg-gray-50">
                Filters
             </button>
          </div>
        </div>

        {/* GRID LAYOUT */}
        {matches.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-rose-100">
             <p className="text-gray-400 text-xl 3xl:text-5xl italic">No matches found. Try updating your profile details!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-8 3xl:gap-16">
            {matches.map((user) => (
              <MatchCard key={user._id} user={user} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Matches;