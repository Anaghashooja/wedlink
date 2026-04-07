import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-64 3xl:w-[500px] bg-slate-900 text-white p-8 3xl:p-20 flex flex-col shrink-0">
      <h2 className="text-2xl 3xl:text-6xl font-bold mb-10 text-rose-500">Wedlink Admin</h2>
      <nav className="space-y-4 3xl:space-y-12 flex-grow">
        <Link 
          to="/admin" 
          className={`block w-full text-left p-3 rounded-xl 3xl:text-4xl transition-all ${isActive('/admin') ? 'bg-slate-800 font-bold text-rose-500' : 'hover:bg-slate-800'}`}
        >
          Overview
        </Link>
        <Link 
          to="/admin/verify" 
          className={`block w-full text-left p-3 rounded-xl 3xl:text-4xl transition-all ${isActive('/admin/verify') ? 'bg-slate-800 font-bold text-rose-500' : 'hover:bg-slate-800'}`}
        >
          Verify Users
        </Link>
        <Link 
          to="/admin/stories" 
          className={`block w-full text-left p-3 rounded-xl 3xl:text-4xl transition-all ${isActive('/admin/stories') ? 'bg-slate-800 font-bold text-rose-500' : 'hover:bg-slate-800'}`}
        >
          Verify Stories
        </Link>
        <Link 
          to="/admin/reports" 
          className={`block w-full text-left p-3 rounded-xl 3xl:text-4xl transition-all ${isActive('/admin/reports') ? 'bg-slate-800 font-bold text-rose-500' : 'hover:bg-slate-800'}`}
        >
          Reports Control
        </Link>
        <Link 
          to="/admin/analytics" 
          className={`block w-full text-left p-3 rounded-xl 3xl:text-4xl transition-all ${isActive('/admin/analytics') ? 'bg-slate-800 font-bold text-rose-500' : 'hover:bg-slate-800'}`}
        >
          Analytics
        </Link>
      </nav>
      <Link to="/" className="mt-auto text-slate-400 3xl:text-3xl text-center hover:text-white transition-colors">
        Back to Site
      </Link>
    </aside>
  );
};

export default AdminSidebar;
