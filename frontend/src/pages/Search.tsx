import React, { useState, useEffect } from 'react';
import { MatchCard } from '../components/MatchCard'; // Refactor MatchCard to a component if possible

const Search: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minAge: '21',
    maxAge: '40',
    religion: '',
    profession: '',
    hobbies: ''
  });

  const handleFetch = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    try {
      const res = await fetch(`http://localhost:3000/api/auth/search?${query}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleFetch(); }, []);

  return (
    <div className="min-h-screen bg-rose-50/20 flex flex-col lg:flex-row font-inter">
      
      {/* SIDEBAR FILTERS (400px on Desktop, Scaled on 3xl) */}
      <aside className="w-full lg:w-[350px] 2xl:w-[450px] 3xl:w-[700px] bg-white border-r border-rose-100 p-6 3xl:p-16 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto">
        <h2 className="text-2xl 3xl:text-6xl font-bold text-gray-800 mb-8">Refine Search</h2>
        
        <div className="space-y-6 3xl:space-y-12">
          {/* Age Range */}
          <div>
            <label className="auth-label block mb-2">Age Range</label>
            <div className="flex gap-4 items-center">
              <input type="number" placeholder="Min" className="auth-input" value={filters.minAge} onChange={(e)=>setFilters({...filters, minAge: e.target.value})} />
              <span className="text-gray-400">to</span>
              <input type="number" placeholder="Max" className="auth-input" value={filters.maxAge} onChange={(e)=>setFilters({...filters, maxAge: e.target.value})} />
            </div>
          </div>

          {/* Religion Select */}
          <div>
            <label className="auth-label block mb-2">Religion</label>
            <select className="auth-input" value={filters.religion} onChange={(e)=>setFilters({...filters, religion: e.target.value})}>
              <option value="">All Religions</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
            </select>
          </div>

          {/* Profession Input */}
          <div>
            <label className="auth-label block mb-2">Profession</label>
            <input type="text" placeholder="e.g. Doctor" className="auth-input" value={filters.profession} onChange={(e)=>setFilters({...filters, profession: e.target.value})} />
          </div>

          {/* Hobbies / Interests */}
          <div>
            <label className="auth-label block mb-2">Hobbies</label>
            <input type="text" placeholder="e.g. Travel, Music" className="auth-input" value={filters.hobbies} onChange={(e)=>setFilters({...filters, hobbies: e.target.value})} />
          </div>

          <button 
            onClick={handleFetch}
            className="w-full bg-rose-500 text-white font-bold py-4 3xl:py-10 rounded-2xl 3xl:rounded-[2rem] shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all 3xl:text-4xl active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* SEARCH RESULTS AREA */}
{/* SEARCH RESULTS AREA */}
<main className="flex-1 p-6 md:p-12 3xl:p-24">
  <div className="flex justify-between items-center mb-10 3xl:mb-20">
      <h1 className="text-3xl 3xl:text-8xl font-bold text-gray-800">
          Found <span className="text-rose-600">{matches.length}</span> Matches
      </h1>
      {loading && <div className="w-8 h-8 3xl:w-16 3xl:h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>}
  </div>

  {matches.length === 0 && !loading ? (
      <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-rose-200">
          <p className="text-gray-400 text-xl 3xl:text-5xl italic">No profiles found matching your criteria.</p>
      </div>
  ) : (
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-8 3xl:gap-16">
          {matches.map(user => (
              /* USE THE COMPONENT HERE */
              <MatchCard key={user._id} user={user} />
          ))}
      </div>
  )}
</main>
    </div>
  );
};

export default Search;