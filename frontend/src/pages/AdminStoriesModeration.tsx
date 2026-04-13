import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const StoriesModeration: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [resStories, resStats] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/admin/stories/pending', { headers }),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/admin/stories/stats', { headers })
      ]);

      setStories(await resStories.json());
      setStats(await resStats.json());
    } catch (err) {
      console.error("Moderation fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/stories/approve/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData(); // Refresh list and stats
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/stories/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  if (loading) return <div className="ml-64 p-20 3xl:text-6xl text-rose-900 font-serif italic">Loading Moderation Queue...</div>;

  return (
    <div className="ml-64 min-h-screen bg-[#fbf9fa] font-inter">
      <AdminSidebar />
      {/* 1. TOP HEADER */}
      <header className="h-20 sticky top-0 z-40 flex justify-between items-center px-12 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <h2 className="text-3xl 3xl:text-6xl font-serif font-bold text-[#6f2434]">Stories Moderation</h2>
        <div className="flex items-center gap-6">
            <div className="relative group hidden xl:block">
                <input className="pl-10 pr-4 py-2 3xl:pl-20 3xl:py-6 3xl:text-3xl bg-gray-50 rounded-full text-sm outline-none border border-transparent focus:border-rose-200 w-64 3xl:w-[600px] transition-all" placeholder="Search stories..." type="text"/>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 3xl:text-4xl">search</span>
            </div>
        </div>
      </header>

      <main className="p-12 3xl:p-32 max-w-7xl 3xl:max-w-[2400px] mx-auto space-y-12 3xl:space-y-32">
        
        {/* 2. STATS BENTO GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 3xl:gap-16">
          <div className="md:col-span-2 bg-white p-8 3xl:p-20 rounded-3xl border border-rose-50 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs 3xl:text-3xl font-bold uppercase tracking-widest text-stone-400 mb-2">Queue Overview</p>
              <h3 className="text-4xl 3xl:text-9xl font-serif font-bold text-[#6f2434]">{stats.pending + stats.approved}</h3>
              <p className="text-sm 3xl:text-3xl text-stone-500 mt-2">Total submissions in history</p>
            </div>
            <div className="mt-8 flex items-center space-x-3">
              <div className="h-2 3xl:h-6 w-full bg-rose-50 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${(stats.approved / (stats.total || 1)) * 100}%` }}></div>
              </div>
              <span className="text-xs 3xl:text-2xl font-bold text-rose-500">{Math.round((stats.approved / (stats.total || 1)) * 100)}% Published</span>
            </div>
          </div>
          
          <StatBox title="Approved" value={stats.approved} color="text-emerald-600" />
          <StatBox title="Pending" value={stats.pending} color="text-amber-500" />
        </section>

        {/* 3. MODERATION LIST */}
        <section className="space-y-10">
          <div className="border-b border-stone-100 pb-6 flex justify-between items-end">
            <div>
              <h4 className="text-2xl 3xl:text-7xl font-serif font-bold text-gray-800">Newly Submitted Stories</h4>
              <p className="text-stone-400 text-sm 3xl:text-3xl italic mt-1">Review and curate the most beautiful unions.</p>
            </div>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-3xl border border-dashed">
                <p className="text-stone-300 text-2xl 3xl:text-6xl font-serif">No stories awaiting review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 3xl:gap-20">
              {stories.map((story) => (
                <article key={story._id} className="bg-white rounded-3xl 3xl:rounded-[4rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-50 group">
                  <div className="h-64 3xl:h-[500px] relative overflow-hidden">
                    <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Couple" />
                    <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md text-white px-4 py-1 3xl:px-10 3xl:py-4 rounded-full text-[10px] 3xl:text-2xl font-bold tracking-widest uppercase">
                        Pending
                    </div>
                  </div>
                  
                  <div className="p-8 3xl:p-16 space-y-4 3xl:space-y-10">
                    <div>
                        <h5 className="text-xl 3xl:text-6xl font-serif font-bold text-gray-900">{story.coupleNames}</h5>
                        <p className="text-xs 3xl:text-3xl text-rose-500 font-bold uppercase tracking-tighter mt-1">{story.location}</p>
                    </div>
                    <p className="text-sm 3xl:text-3xl text-gray-500 italic line-clamp-3 leading-relaxed">
                        "{story.testimonial}"
                    </p>
                    
                    <div className="pt-6 3xl:pt-12 border-t border-stone-50 flex items-center gap-3">
                        <button 
                          onClick={() => handleApprove(story._id)}
                          className="flex-1 bg-[#6f2434] text-white py-3 3xl:py-8 rounded-xl 3xl:rounded-3xl text-xs 3xl:text-3xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined 3xl:text-5xl">check_circle</span> Approve
                        </button>
                        <button 
                          onClick={() => handleDelete(story._id)}
                          className="p-3 3xl:p-8 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <span className="material-symbols-outlined 3xl:text-5xl">delete</span>
                        </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatBox = ({ title, value, color }: any) => (
  <div className="bg-white p-8 3xl:p-20 rounded-3xl border border-rose-50 shadow-sm">
    <p className="text-xs 3xl:text-3xl font-bold uppercase tracking-widest text-stone-400 mb-2">{title}</p>
    <h3 className={`text-4xl 3xl:text-9xl font-serif font-bold ${color}`}>{value}</h3>
  </div>
);

export default StoriesModeration;