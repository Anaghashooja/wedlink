import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const ReportedChats = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/admin/reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setReports(data);
    setLoading(false);
  };

  const viewTranscript = async (report: any) => {
    setSelectedReport(report);
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/reports/transcript/${report.conversationId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setTranscript(await res.json());
  };

  const handleAction = async (action: string) => {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/action/${selectedReport.reportedUser._id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, reportId: selectedReport._id })
    });
    setSelectedReport(null);
    fetchReports();
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <div className="ml-64 p-20 3xl:text-6xl text-rose-900 font-serif italic">Loading Archive...</div>;

  return (
    <div className="ml-64 flex flex-col h-screen overflow-hidden bg-[#fbf9fa]">
      <AdminSidebar />
      {/* HEADER */}
      <header className="bg-white border-b border-rose-50 px-12 py-6 flex justify-between items-center shrink-0">
        <h2 className="text-3xl 3xl:text-6xl font-serif font-bold text-[#6f2434]">Moderation Center</h2>
        <div className="flex gap-4">
          <span className="bg-rose-50 text-rose-600 px-4 py-1 3xl:px-10 3xl:py-4 rounded-full font-bold 3xl:text-2xl uppercase">
            {reports.length} Open Cases
          </span>
        </div>
      </header>

      {/* DYNAMIC CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: QUEUE AUDIT (List of Reports) */}
        <section className="flex-1 p-8 3xl:p-20 overflow-y-auto custom-scrollbar space-y-4">
          <h3 className="text-xl 3xl:text-5xl font-bold text-gray-800 mb-6 font-serif italic">Queue Audit</h3>
          {reports.map((r) => (
            <div 
              key={r._id} 
              onClick={() => viewTranscript(r)}
              className={`p-5 3xl:p-12 rounded-2xl border-l-4 transition-all cursor-pointer flex items-center justify-between ${
                selectedReport?._id === r._id ? 'bg-white shadow-xl border-rose-500 scale-[1.02]' : 'bg-white/50 border-transparent hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-4 3xl:gap-10">
                <img src={r.reportedUser.photos?.[0]} className="w-12 h-12 3xl:w-32 3xl:h-32 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-gray-800 3xl:text-4xl">{r.reportedUser.name}</h4>
                  <p className="text-xs 3xl:text-2xl text-gray-400">Reported by {r.reporter.name}</p>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 px-3 py-1 3xl:px-8 3xl:py-3 rounded-full text-[10px] 3xl:text-xl font-bold uppercase tracking-wider">
                {r.reason}
              </span>
              <button className="bg-[#6f2434] text-white px-6 py-2 3xl:px-12 3xl:py-5 rounded-xl text-xs 3xl:text-2xl font-bold">Review</button>
            </div>
          ))}
        </section>

        {/* RIGHT: DETAILED CASE REVIEW */}
        <aside className="w-[450px] 3xl:w-[900px] bg-white border-l border-rose-50 flex flex-col shadow-2xl relative z-10">
          {selectedReport ? (
            <>
              <div className="p-8 3xl:p-20 border-b border-rose-50">
                <p className="text-[10px] 3xl:text-xl font-bold text-rose-500 uppercase tracking-[0.2em] mb-4">Active Case #{selectedReport._id.slice(-4)}</p>
                <div className="flex -space-x-4 mb-6 3xl:mb-12">
                   <img src={selectedReport.reporter.photos?.[0]} className="w-14 h-14 3xl:w-32 3xl:h-32 rounded-full border-4 border-white shadow-md" />
                   <img src={selectedReport.reportedUser.photos?.[0]} className="w-14 h-14 3xl:w-32 3xl:h-32 rounded-full border-4 border-white shadow-md" />
                </div>
                <h3 className="text-xl 3xl:text-5xl font-bold text-gray-800 font-serif italic">Transcript: {selectedReport.reporter.name} & {selectedReport.reportedUser.name}</h3>
              </div>

              {/* TRANSCRIPT AREA */}
              <div className="flex-1 p-8 3xl:p-20 overflow-y-auto bg-stone-50/50 space-y-4 custom-scrollbar">
                {transcript.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === selectedReport.reporter._id ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 3xl:p-10 rounded-2xl text-sm 3xl:text-3xl max-w-[85%] ${
                        msg.sender === selectedReport.reporter._id ? 'bg-rose-100 text-rose-900 rounded-tr-none' : 'bg-white text-gray-700 border border-rose-50 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BAR */}
              <div className="p-8 3xl:p-16 bg-white border-t border-rose-50 space-y-3 3xl:space-y-8">
                <div className="grid grid-cols-2 gap-3 3xl:gap-8">
                  <button onClick={() => setSelectedReport(null)} className="py-3 3xl:py-8 border border-rose-100 rounded-xl font-bold text-xs 3xl:text-3xl text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Dismiss</button>
                  <button onClick={() => handleAction('warn')} className="py-3 3xl:py-8 bg-amber-500 text-white rounded-xl font-bold text-xs 3xl:text-3xl uppercase tracking-widest hover:bg-amber-600 transition-all">Send Warning</button>
                </div>
                <button onClick={() => handleAction('ban')} className="w-full bg-[#6f2434] text-white py-4 3xl:py-10 rounded-xl font-bold text-xs 3xl:text-3xl uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined 3xl:text-5xl">gavel</span> Permanent Ban
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-300 p-20 text-center">
              <span className="material-symbols-outlined text-8xl 3xl:text-[15rem] mb-4">forum</span>
              <p className="font-serif italic 3xl:text-5xl">Select a case from the queue to begin the audit.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default ReportedChats;