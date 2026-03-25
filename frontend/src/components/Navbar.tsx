import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {io} from "socket.io-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Keep Navbar updated on route change
  
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/auth');
  };
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    if (!userId) return;

    // Connect to Socket server
    const socket = io("http://localhost:3000");

    // Join personal room
    socket.emit("join", userId);

    // Listen for new interest
    socket.on("new_interest", (data) => {
      setUnreadCount((prev) => prev + 1);
      // Optional: Show a browser alert or custom toast
      alert(`${data.fromName} ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);


  useEffect(() => {
    const fetchCount = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/api/requests/count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUnreadCount(data.count);
      } catch (err) {
        console.error("Count fetch failed");
      }
    };

    fetchCount();
    // Optional: Refresh every 30 seconds to simulate real-time
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-inter">
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2400px] mx-auto px-4 md:px-12 3xl:px-24">
        <div className="flex justify-between h-20 3xl:h-48 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img src="/logo.png" alt="Logo" className="h-12 md:h-16 3xl:h-32 w-auto object-contain" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 xl:space-x-8 3xl:space-x-16 items-center">
            <Link to="/" className="text-gray-700 hover:text-rose-500 font-semibold 3xl:text-4xl transition-colors">Home</Link>
            <Link to="/matches" className="text-gray-700 hover:text-rose-500 font-semibold 3xl:text-4xl transition-colors">Find Matches</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 3xl:space-x-12">
                
                {/* ATTRACTIVE INBOX PILL */}
                <Link 
                  to="/inbox" 
                  className="group flex items-center gap-2 p-1 pr-4 rounded-full bg-rose-50 border border-rose-100 hover:bg-rose-500 transition-all duration-300 relative shadow-sm"
                >
                  <div className="w-10 h-10 3xl:w-20 3xl:h-20 rounded-full bg-rose-500 flex items-center justify-center text-white group-hover:bg-white group-hover:text-rose-500 transition-colors relative">
                    {/* Inbox/Mail Icon */}
                    <svg className="w-5 h-5 3xl:w-10 3xl:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    
                    {/* Animated Notification Dot */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 3xl:h-6 3xl:w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 3xl:h-6 3xl:w-6 bg-rose-600 border-2 border-white 3xl:border-4"></span>
                    </span>  {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 3xl:h-8 3xl:w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 3xl:h-8 3xl:w-8 bg-rose-600 border-2 border-white text-[10px] 3xl:text-lg text-white items-center justify-center font-bold">
                {unreadCount}
              </span>
            </span>
          )}
                  </div>
                  <span className="text-rose-700 group-hover:text-white font-bold 3xl:text-3xl">Inbox</span>
                </Link>

                {/* MY PROFILE PILL */}
                <Link 
                  to="/profile" 
                  className="group flex items-center gap-2 p-1 pr-4 rounded-full bg-rose-50 border border-rose-100 hover:bg-rose-500 transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 h-10 3xl:w-20 3xl:h-20 rounded-full bg-rose-500 flex items-center justify-center text-white group-hover:bg-white group-hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5 3xl:w-10 3xl:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-rose-700 group-hover:text-white font-bold 3xl:text-3xl">My Profile</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-rose-600 font-bold 3xl:text-3xl transition-colors pl-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-rose-500 text-white px-8 py-2.5 3xl:px-16 3xl:py-6 rounded-full font-bold 3xl:text-4xl hover:bg-rose-600 transition shadow-lg shadow-rose-100"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 space-y-4 shadow-xl">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 font-semibold text-lg border-b pb-2">Home</Link>
          <Link to="/matches" onClick={() => setIsOpen(false)} className="block text-gray-700 font-semibold text-lg border-b pb-2">Find Matches</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/inbox" onClick={() => setIsOpen(false)} className="block text-rose-600 font-bold text-lg border-b pb-2">Inbox (New)</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-rose-600 font-bold text-lg border-b pb-2">My Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left text-gray-400 font-bold text-lg">Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="block bg-rose-500 text-white text-center py-4 rounded-2xl font-bold text-lg">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;