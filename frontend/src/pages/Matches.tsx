import React, { useEffect, useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { PageLayout } from '../components/PageLayout';
import { API_BASE_URL } from '../config';

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
        const res = await fetch(`${API_BASE_URL}/api/auth/matches`, {
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
    <PageLayout
      title={<>Recommended <span className="text-rose-600">Matches</span></>}
      subtitle="Based on your profile preferences and values."
     
    >
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
    </PageLayout>
  );
};

export default Matches;