import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-rose-50">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-rose-600 font-bold 3xl:text-5xl">Loading your conversations...</p>
    </div>
  );

  return (
    <div className="bg-white text-gray-900 min-h-screen pb-32">
      
      {/* 1. BRANDED HEADER WITH LOGO */}
      <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-rose-50">
        <div className="flex justify-between items-center max-w-7xl 3xl:max-w-[2400px] mx-auto px-6 py-3 3xl:py-10">
          <Link to="/">
            <img src="/logo.png" alt="Wedlink Logo" className="h-12 md:h-16 3xl:h-32 w-auto object-contain" />
          </Link>
          <div className="flex gap-4 3xl:gap-10">
            <button className="text-gray-400 hover:text-rose-500 transition-colors 3xl:scale-150">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-gray-400 hover:text-rose-500 transition-colors 3xl:scale-150">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 3xl:pt-52 px-6 max-w-4xl 3xl:max-w-[1800px] mx-auto">
        
        {/* Title Area */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl 3xl:text-8xl font-bold text-gray-800 tracking-tight">Messages</h2>
            <span className="bg-rose-500 text-white px-4 py-1 3xl:px-10 3xl:py-4 rounded-full text-xs 3xl:text-3xl font-bold uppercase tracking-widest">
              {conversations.length} Active
            </span>
          </div>
          
          {/* Branded Search Bar */}
          <div className="relative">
             
            <input 
              className="w-full bg-rose-50/50 border border-rose-100 rounded-2xl 3xl:rounded-[2rem] py-4 pl-12 3xl:pl-24 3xl:py-10 3xl:text-4xl focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-gray-400" 
              placeholder="Search matches or messages..." 
            />
          </div>
        </div>

        {/* New Connections Horizontal Bar */}
        <section className="mb-12 overflow-hidden">
          <h3 className="text-xs 3xl:text-3xl font-bold text-gray-400 uppercase tracking-widest mb-6">Recently Accepted</h3>
          <div className="flex gap-5 3xl:gap-12 overflow-x-auto pb-4 no-scrollbar">
            {conversations.length === 0 ? (
              <p className="text-gray-400 italic text-sm 3xl:text-3xl">No new connections yet.</p>
            ) : (
              conversations.slice(0, 5).map((user, i) => (
                <div key={i} className="flex-none text-center space-y-3 group cursor-pointer">
                  <div className="w-16 h-16 md:w-20 md:h-20 3xl:w-48 3xl:h-48 rounded-full p-1 border-2 border-rose-500 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                    <img src={user.photos?.[0] || `https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full object-cover rounded-full" alt="" />
                  </div>
                  <span className="block text-xs 3xl:text-2xl font-bold text-gray-700">{user.name.split(' ')[0]}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Conversation List */}
        <section className="space-y-4 3xl:space-y-10">
          <h3 className="text-xs 3xl:text-3xl font-bold text-gray-400 uppercase tracking-widest mb-2">Recent Chats</h3>
          {conversations.map((user) => (
            <Link 
              to={`/chat/${user._id}`} 
              key={user._id} 
              className="block bg-white rounded-3xl 3xl:rounded-[3rem] p-5 3xl:p-14 transition-all hover:shadow-xl hover:bg-rose-50/30 border border-gray-100 group"
            >
              <div className="flex gap-5 3xl:gap-12 items-center">
                {/* User Avatar */}
                <div className="relative flex-none">
                  <img 
                    src={user.photos?.[0] || `https://ui-avatars.com/api/?name=${user.name}`} 
                    className="w-16 h-16 md:w-20 md:h-20 3xl:w-44 3xl:h-44 rounded-2xl 3xl:rounded-[2rem] object-cover shadow-sm group-hover:rotate-2 transition-transform" 
                    alt="" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 3xl:w-10 3xl:h-10 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>

                {/* Text Details */}
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-xl 3xl:text-6xl text-gray-800 truncate">{user.name}</h4>
                    <span className="text-[10px] 3xl:text-2xl font-bold text-gray-400 uppercase">Today</span>
                  </div>
                  <p className="text-sm 3xl:text-4xl text-gray-500 truncate font-medium mt-1">
                    Matched via {user.religion || 'Community'} • Click to send a message
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="flex-none text-rose-200 group-hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined 3xl:text-6xl">chevron_right</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      {/* FOOTER NAV (MOBILE ONLY or PERSISTENT) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md 3xl:max-w-4xl flex justify-around items-center px-4 py-4 3xl:py-10 bg-gray-900 text-white rounded-3xl 3xl:rounded-[3rem] shadow-2xl z-50">
        <Link to="/matches" className="text-gray-500 hover:text-white"><span className="material-symbols-outlined 3xl:text-6xl">explore</span></Link>
        <Link to="/inbox" className="text-gray-500 hover:text-white"><span className="material-symbols-outlined 3xl:text-6xl">favorite</span></Link>
        <Link to="/messages" className="text-rose-500"><span className="material-symbols-outlined 3xl:text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>chat_bubble</span></Link>
        <Link to="/profile" className="text-gray-500 hover:text-white"><span className="material-symbols-outlined 3xl:text-6xl">person</span></Link>
      </nav>
    </div>
  );
};

export default MessagesPage;