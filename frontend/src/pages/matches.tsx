import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface UserProfile {
  _id: string;
  name: string;
  profession?: string;
  religion?: string;
  age?: number;
  photos?: string[];
}

// SUB-COMPONENT FOR INDIVIDUAL CARDS
const MatchCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to connect with matches");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/requests/send/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      if (res.ok) {
        setIsSent(true);
      } else {
        alert(data.msg || "Failed to send request");
      }
    } catch (err) {
      alert("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] 3xl:rounded-[3rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all group border border-gray-100 flex flex-col h-full">
      {/* PROFILE IMAGE */}
      <div className="relative h-64 md:h-80 3xl:h-[500px] bg-rose-100 overflow-hidden">
        <Link to={`/profile/${user._id}`}>
          <img
            src={user.photos && user.photos.length > 0 
              ? user.photos[0] 
              : `https://ui-avatars.com/api/?name=${user.name}&background=fda4af&color=fff&size=512`
            }
            alt={user.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-rose-600 font-bold text-xs 3xl:text-xl">
          {user.photos && user.photos.length > 0 ? `${user.photos.length} Photos` : 'No Photo'}
        </div>
      </div>

      {/* USER DETAILS */}
      <div className="p-6 md:p-8 3xl:p-14 space-y-3 3xl:space-y-6 flex-grow">
        <h3 className="text-xl md:text-2xl 3xl:text-5xl font-bold text-gray-900">{user.name}</h3>
        <div className="text-gray-500 text-sm md:text-lg 3xl:text-3xl font-medium">
          {user.profession || 'Member'} • {user.religion || 'Community'}
        </div>

        <div className="pt-4 flex gap-3 3xl:gap-6 mt-auto">
          <button
            onClick={handleConnect}
            disabled={isSent || loading}
            className={`flex-grow font-bold py-3 3xl:py-6 rounded-xl 3xl:rounded-[1.5rem] transition shadow-lg 3xl:text-3xl active:scale-95 ${
              isSent 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-100'
            }`}
          >
            {loading ? "..." : isSent ? "Pending" : "Connect"}
          </button>
          <button className="p-3 3xl:p-6 border-2 border-rose-100 rounded-xl 3xl:rounded-[1.5rem] text-rose-500 hover:bg-rose-50 transition">
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

// MAIN PAGE COMPONENT
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
        console.error("Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <div className="text-center py-20 3xl:text-4xl text-rose-500 font-bold">Finding your matches...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 3xl:p-24 font-inter">
      <div className="max-w-7xl 3xl:max-w-[2400px] mx-auto">
        <h1 className="text-3xl md:text-4xl 3xl:text-7xl font-bold text-gray-800 mb-8 3xl:mb-16">
          Profiles Recommended for You
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 3xl:grid-cols-4 gap-8 3xl:gap-16">
          {matches.map((user) => (
            <MatchCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;