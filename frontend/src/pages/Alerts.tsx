import React, { useEffect, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns'; // npm install date-fns

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => { fetchAlerts(); }, []);

  // Logic to group alerts by date
  const groupedAlerts = alerts.reduce((groups: any, alert) => {
    const date = new Date(alert.createdAt);
    let label = 'Earlier This Week';
    if (isToday(date)) label = 'Today';
    else if (isYesterday(date)) label = 'Yesterday';
    
    if (!groups[label]) groups[label] = [];
    groups[label].push(alert);
    return groups;
  }, {});

  if (loading) return <div className="text-center py-20 3xl:text-6xl text-rose-500 italic">Reading your archive...</div>;

  return (
    <div className="bg-[#fff8f4] min-h-screen font-inter pb-32 selection:bg-rose-100">
      <main className="pt-24 3xl:pt-48 px-6 max-w-2xl 3xl:max-w-5xl mx-auto">
        
        {/* Header Section */}
        <section className="mb-12 3xl:mb-24">
          <h1 className="text-4xl 3xl:text-9xl font-serif italic text-rose-950 font-bold leading-tight">
            Your <span className="text-rose-500">Alerts</span>
          </h1>
          <p className="text-gray-500 text-lg 3xl:text-4xl mt-4">Stay updated on your journey towards a lifetime union.</p>
        </section>

        {/* Alerts List */}
        <div className="space-y-12 3xl:space-y-24">
          {Object.keys(groupedAlerts).map((label) => (
            <div key={label} className="space-y-4 3xl:space-y-10">
              <h3 className="text-[10px] 3xl:text-2xl font-bold uppercase tracking-[0.3em] text-stone-400 ml-2">{label}</h3>
              
              <div className="space-y-3 3xl:space-y-8">
                {groupedAlerts[label].map((alert: any) => (
                  <div key={alert._id} className={`group bg-white p-5 3xl:p-14 rounded-[1.5rem] 3xl:rounded-[3rem] shadow-sm border border-rose-50 flex gap-5 3xl:gap-12 items-start transition-all hover:shadow-xl hover:translate-x-2 ${!alert.isRead ? 'border-l-4 border-l-rose-500' : ''}`}>
                    
                    {/* Icon / Image Logic */}
                    <div className="w-14 h-14 3xl:w-32 3xl:h-32 rounded-xl 3xl:rounded-3xl overflow-hidden flex-shrink-0 bg-rose-50 flex items-center justify-center">
                      {alert.sender?.photos?.[0] ? (
                        <img src={alert.sender.photos[0]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="material-symbols-outlined text-[#6f2434] 3xl:text-7xl">
                          {alert.type === 'verification' ? 'verified_user' : 'notifications'}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 text-base 3xl:text-5xl">{alert.title}</h4>
                        <span className="text-[10px] 3xl:text-2xl text-stone-400 font-medium">
                          {format(new Date(alert.createdAt), 'p')}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm 3xl:text-4xl leading-relaxed mt-1">{alert.message}</p>
                      
                      {!alert.isRead && <span className="inline-block mt-3 w-2 h-2 3xl:w-5 3xl:h-5 bg-rose-500 rounded-full animate-pulse"></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-40">
             <span className="material-symbols-outlined text-8xl 3xl:text-[15rem] text-stone-200">notifications_off</span>
             <p className="text-stone-400 3xl:text-5xl font-serif italic mt-6">Your archive is currently empty.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Alerts;