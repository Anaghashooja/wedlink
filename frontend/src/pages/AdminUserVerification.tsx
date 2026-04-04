import React, { useEffect, useState } from 'react';

const UserVerification: React.FC = () => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/verifications/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplicants(); }, []);

  const handleAction = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/verifications/handle/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status, note: notes[id] || "" })
      });
      fetchApplicants(); // Refresh list
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <div className="ml-64 p-20 3xl:text-6xl text-rose-900 font-serif italic">Accessing Secure Vault...</div>;

  return (
    <div className="ml-64 min-h-screen bg-[#fbf9fa] font-inter">
      {/* HEADER */}
      <header className="h-20 sticky top-0 z-40 flex justify-between items-center px-12 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <h2 className="text-3xl 3xl:text-6xl font-serif font-bold text-[#6f2434]">Verification Queue</h2>
        <div className="flex items-center gap-4">
            <span className="bg-rose-100 text-rose-700 px-4 py-1 3xl:px-10 3xl:py-4 rounded-full text-xs 3xl:text-2xl font-bold uppercase tracking-widest">
                {applicants.length} Pending
            </span>
        </div>
      </header>

      <main className="p-12 3xl:p-32 max-w-7xl 3xl:max-w-[2400px] mx-auto space-y-10 3xl:space-y-24">
        
        {/* SUMMARY STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 3xl:gap-16">
          <StatBox title="Pending Total" value={applicants.length} sub="Applicants" />
          <StatBox title="Avg. Wait Time" value="14" sub="Hours" />
          <StatBox title="System Status" value="Live" sub="Operational" />
        </section>

        {/* VERIFICATION LIST */}
        <section className="space-y-8 3xl:space-y-20">
          {applicants.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-3xl border border-dashed">
                <p className="text-stone-400 text-2xl font-serif italic">The queue is empty. Excellent work.</p>
            </div>
          ) : (
            applicants.map((user) => (
              <article key={user._id} className="bg-white rounded-[2rem] 3xl:rounded-[4rem] p-8 3xl:p-20 shadow-sm border border-stone-100 flex flex-col lg:flex-row gap-10 3xl:gap-20 items-start">
                
                {/* User Metadata */}
                <div className="w-full lg:w-1/4 space-y-4 3xl:space-y-10">
                  <div>
                    <h4 className="text-2xl 3xl:text-6xl font-serif font-bold text-gray-900">{user.name}</h4>
                    <p className="text-sm 3xl:text-3xl text-stone-400">UID: #{user._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1 3xl:space-y-4">
                    <p className="text-[10px] 3xl:text-xl font-bold text-stone-400 uppercase tracking-widest">Profession</p>
                    <p className="text-sm 3xl:text-3xl font-semibold text-rose-900">{user.profession}</p>
                  </div>
                  <div className="space-y-1 3xl:space-y-4">
                    <p className="text-[10px] 3xl:text-xl font-bold text-stone-400 uppercase tracking-widest">Community</p>
                    <p className="text-sm 3xl:text-3xl font-semibold text-gray-700">{user.religion}</p>
                  </div>
                </div>

                {/* Comparison View */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 3xl:gap-12 w-full">
                  <div className="space-y-2 3xl:space-y-6">
                    <p className="text-[10px] 3xl:text-xl font-bold text-center text-stone-400 uppercase tracking-widest">Government ID</p>
                    <div className="aspect-[4/3] rounded-2xl 3xl:rounded-[3rem] overflow-hidden bg-gray-100 border border-stone-100">
                        <img src={user.verificationDoc} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all cursor-zoom-in" alt="ID" />
                    </div>
                  </div>
                  <div className="space-y-2 3xl:space-y-6">
                    <p className="text-[10px] 3xl:text-xl font-bold text-center text-stone-400 uppercase tracking-widest">Profile Photo</p>
                    <div className="aspect-[4/3] rounded-2xl 3xl:rounded-[3rem] overflow-hidden bg-gray-100 border border-stone-100 relative">
                        <img src={user.photos?.[0]} className="w-full h-full object-cover" alt="Selfie" />
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] 3xl:text-xl text-white font-bold tracking-widest">LIVE</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-1/4 flex flex-col gap-4 3xl:gap-10 self-stretch">
                   <textarea 
                    placeholder="Moderation Notes..."
                    className="flex-1 w-full bg-stone-50 border-none rounded-2xl 3xl:rounded-[2rem] p-4 3xl:p-8 text-sm 3xl:text-2xl outline-none focus:ring-1 focus:ring-rose-200"
                    onChange={(e) => setNotes({ ...notes, [user._id]: e.target.value })}
                   />
                   <div className="grid grid-cols-2 gap-3 3xl:gap-8">
                     <button onClick={() => handleAction(user._id, 'rejected')} className="py-3 3xl:py-8 bg-stone-100 text-stone-500 font-bold rounded-xl 3xl:rounded-3xl hover:bg-red-50 hover:text-red-600 transition-all 3xl:text-3xl">REJECT</button>
                     <button onClick={() => handleAction(user._id, 'verified')} className="py-3 3xl:py-8 bg-[#6f2434] text-white font-bold rounded-xl 3xl:rounded-3xl shadow-lg hover:bg-black transition-all 3xl:text-3xl">APPROVE</button>
                   </div>
                </div>

              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

const StatBox = ({ title, value, sub }: any) => (
    <div className="bg-white p-8 3xl:p-16 rounded-3xl shadow-sm border border-stone-50">
        <p className="text-[10px] 3xl:text-2xl font-bold uppercase tracking-widest text-stone-400 mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-5xl 3xl:text-9xl font-serif text-[#6f2434] font-bold">{value}</span>
            <span className="text-xs 3xl:text-2xl text-stone-500 font-medium uppercase tracking-tighter">{sub}</span>
        </div>
    </div>
);

export default UserVerification;