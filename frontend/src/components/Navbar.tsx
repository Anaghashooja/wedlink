import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import { API_BASE_URL } from '../config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 1. Get User Data from Token
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  let role = 'user';
  let userId = null;
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role || 'user';
      userId = payload.id;
    } catch {
      console.error("Token error");
    }
  }

  const isAdmin = isLoggedIn && role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/auth');
  };

  const [unreadCount, setUnreadCount] = useState(0);

  // User-only socket effect
  useEffect(() => {
    if (!userId || isAdmin) return;
    const socket = io(API_BASE_URL);
    socket.emit("join", userId);
    socket.on("new_interest", () => setUnreadCount((prev) => prev + 1));
    return () => { socket.disconnect(); };
  }, [userId, isAdmin]);

  // User-only fetch count effect
  useEffect(() => {
    if (!token || isAdmin) return;
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/requests/count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUnreadCount(data.count);
      } catch { console.error("Count failed"); }
    };
    fetchCount();
  }, [token, location.pathname, isAdmin]);


  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 transition-all ${isAdminRoute ? 'ml-64' : ''}`}>
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2400px] mx-auto px-4 md:px-12 3xl:px-24">
        <div className="flex justify-between h-20 3xl:h-48 items-center">
          
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <img src="/logo.png" alt="Logo" className="h-12 md:h-16 3xl:h-32 w-auto object-contain" />
            </Link>
            {isAdmin && (
              <span className="bg-slate-800 text-white px-3 py-1 3xl:px-8 3xl:py-4 rounded-lg text-[10px] 3xl:text-3xl font-bold uppercase tracking-widest">
                Admin Panel
              </span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 3xl:space-x-16 items-center">
            
            {/* COMMON LINKS (GUESTS & USERS ONLY) */}
            {!isAdmin && (
              <>
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/matches" className="nav-link">Find Matches</NavLink>
                <NavLink to="/stories" className="nav-link">Stories</NavLink>
                <NavLink to="/plans" className="nav-link">Plans</NavLink>
              </>
            )}

            {/* ADMIN-ONLY LINK */}
            {isAdmin && (
              <Link to="/admin" className="text-slate-800 font-bold 3xl:text-4xl hover:text-rose-500 transition-colors">
                Dashboard Overview
              </Link>
            )}

            {isLoggedIn ? (
              <div className="flex items-center space-x-4 3xl:space-x-12">
                
                {/* USER-ONLY PILLS */}
                {!isAdmin && (
                  <>
                    <NavPill to="/search" icon="search" label="Search" />
                    <NavPill to="/messages" icon="mail" label="Inbox" count={unreadCount} />
                    <NavPill to="/profile" icon="person" label="Profile" />
                  </>
                )}

                <button 
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-rose-600 font-bold 3xl:text-4xl pl-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-rose-500 text-white px-8 py-2.5 3xl:px-16 3xl:py-6 rounded-full font-bold 3xl:text-4xl hover:bg-rose-600 transition shadow-lg">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /> : <path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 space-y-4 shadow-xl">
          {!isAdmin ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className="mobile-link">Home</Link>
              <Link to="/matches" onClick={() => setIsOpen(false)} className="mobile-link">Find Matches</Link>
              {isLoggedIn && (
                <>
                  <Link to="/search" onClick={() => setIsOpen(false)} className="mobile-link text-rose-600">Search</Link>
                  <Link to="/messages" onClick={() => setIsOpen(false)} className="mobile-link text-rose-600">Inbox ({unreadCount})</Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)} className="mobile-link">Settings</Link>
                  <Link to="/alerts" onClick={() => setIsOpen(false)} className="mobile-link text-rose-600">Alerts</Link>
                </>
              )}
            </>
          ) : (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="mobile-link font-bold text-slate-800">Admin Dashboard</Link>
          )}
          
          <button onClick={isLoggedIn ? handleLogout : () => navigate('/auth')} className={`w-full text-center py-4 rounded-2xl font-bold text-lg ${isLoggedIn ? 'bg-gray-100 text-gray-500' : 'bg-rose-500 text-white'}`}>
            {isLoggedIn ? 'Logout' : 'Login / Register'}
          </button>
        </div>
      </div>
    </nav>
  );
};

// Helper Components for Cleaner Code
interface NavPillProps {
  to: string;
  icon: string;
  label: string;
  count?: number;
}

const NavPill = ({ to, icon, label, count = 0 }: NavPillProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `group flex items-center gap-2 p-1 pr-4 rounded-full border transition-all duration-300 relative shadow-sm ${
      isActive 
      ? 'bg-rose-500 border-rose-500 text-white' 
      : 'bg-rose-50 border-rose-100 hover:bg-rose-500'
    }`}
  >
    <div className={`w-10 h-10 3xl:w-20 3xl:h-20 rounded-full flex items-center justify-center transition-colors relative ${
      // We use a nested check or simpler logic: if parent is active (via class), we change colors
      'bg-rose-500 text-white group-[.active]:bg-white group-[.active]:text-rose-500 group-hover:bg-white group-hover:text-rose-500'
    }`}>
      <span className="material-symbols-outlined 3xl:text-5xl">{icon}</span>
      {count > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 3xl:h-8 3xl:w-8"><span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative flex rounded-full h-4 w-4 3xl:h-8 3xl:w-8 bg-rose-600 border border-white text-[8px] 3xl:text-lg items-center justify-center font-bold">{count}</span></span>}
    </div>
    <span className={`font-bold 3xl:text-3xl uppercase text-[10px] tracking-wider group-hover:text-white transition-colors ${
      'text-rose-700 group-[.active]:text-white'
    }`}>{label}</span>
  </NavLink>
);

export default Navbar;