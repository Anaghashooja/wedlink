import React, { useEffect, useState } from 'react';
import { MatchCard } from '../components/MatchCard';

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

// MAIN PAGE
const Matches: React.FC = () => {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/auth/matches', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Fetch failed", err);
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