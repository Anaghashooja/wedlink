import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [blockedList, setBlockedList] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch User Data
  const fetchUser = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (err) { console.error("User fetch failed", err); }
  };

  // Fetch Blocked Users
  const fetchBlocked = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/user/blocked-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBlockedList(data);
    } catch (err) { console.error("Blocked list fetch failed", err); }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch blocked list only when navigating to privacy tab
  useEffect(() => {
    if (activeTab === 'privacy') fetchBlocked();
  }, [activeTab]);

  const handleUnblock = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/unblock/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setBlockedList(prev => prev.filter(u => u._id !== id));
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match");
    
    setIsActionLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/user/settings/password', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          currentPassword: passwords.current, 
          newPassword: passwords.new 
        })
      });
      const data = await res.json();
      alert(data.msg);
      if (res.ok) setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) { alert("Failed to update password"); }
    finally { setIsActionLoading(false); }
  };

  const handleNotifyToggle = async (key: string) => {
    const newSettings = { ...user.notificationSettings, [key]: !user.notificationSettings[key] };
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/user/settings/notifications', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(newSettings)
    });
    if (res.ok) setUser({ ...user, notificationSettings: newSettings });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete your Wedlink profile and all matches.")) {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/user/settings/account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f4] font-inter selection:bg-rose-100 pb-20">
      <main className="pt-24 3xl:pt-48 px-6 max-w-7xl 3xl:max-w-[2400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* SIDE NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          <h2 className="font-serif italic text-3xl 3xl:text-7xl text-[#6f2434] mb-10">Personal Sanctuary</h2>
          <nav className="flex flex-col gap-2 3xl:gap-6">
            <TabBtn active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon="lock" label="Account Security" />
            <TabBtn active={activeTab === 'notify'} onClick={() => setActiveTab('notify')} icon="notifications" label="Notifications" />
            <TabBtn active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} icon="shield" label="Privacy & Safety" />
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* SECTION 1: ACCOUNT SECURITY */}
          {activeTab === 'account' && (
            <section className="bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-xl border border-rose-50 animate-fade-in">
              <div className="mb-10 3xl:mb-20">
                <h3 className="font-serif text-3xl 3xl:text-7xl text-gray-900 mb-2 font-bold">Account Security</h3>
                <p className="text-gray-400 italic 3xl:text-3xl font-serif">Update your protective barrier.</p>
              </div>
              <form onSubmit={handlePasswordUpdate} className="max-w-md 3xl:max-w-3xl space-y-6 3xl:space-y-12">
                <InputGroup 
                  label="Current Password" type="password" 
                  value={passwords.current} 
                  onChange={(val: string) => setPasswords({...passwords, current: val})} 
                />
                <InputGroup 
                  label="New Password" type="password" 
                  value={passwords.new} 
                  onChange={(val: string) => setPasswords({...passwords, new: val})} 
                />
                <InputGroup 
                  label="Confirm New Password" type="password" 
                  value={passwords.confirm} 
                  onChange={(val: string) => setPasswords({...passwords, confirm: val})} 
                />
                <button 
                  type="submit"
                  disabled={isActionLoading}
                  className="px-10 py-4 3xl:py-10 bg-gradient-to-r from-[#6f2434] to-[#8d3b4a] text-white rounded-full font-bold 3xl:text-4xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isActionLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>
          )}

          {/* SECTION 2: NOTIFICATIONS */}
          {activeTab === 'notify' && (
            <section className="bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-xl border border-rose-50 animate-fade-in">
              <h3 className="font-serif text-3xl 3xl:text-7xl text-gray-900 mb-10 font-bold">Notification Preferences</h3>
              <div className="divide-y divide-rose-50">
                <ToggleRow 
                  title="Email Digest" 
                  desc="Weekly summaries of new matches." 
                  icon="mail"
                  checked={user?.notificationSettings?.emailDigest}
                  onToggle={() => handleNotifyToggle('emailDigest')}
                />
                <ToggleRow 
                  title="Push Alerts" 
                  desc="Instant notifications for messages." 
                  icon="notifications_active"
                  checked={user?.notificationSettings?.pushNotifications}
                  onToggle={() => handleNotifyToggle('pushNotifications')}
                />
              </div>
            </section>
          )}

          {/* SECTION 3: PRIVACY & SAFETY */}
          {activeTab === 'privacy' && (
            <section className="bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-xl border border-rose-50 animate-fade-in space-y-12">
              <div>
                <h3 className="font-serif text-3xl 3xl:text-7xl text-gray-900 mb-6 font-bold">Blocked Souls</h3>
                {blockedList.length === 0 ? (
                  <p className="text-gray-400 italic 3xl:text-3xl">No one is currently blocked. Your sanctuary is peaceful.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 3xl:gap-10">
                    {blockedList.map(u => (
                      <div key={u._id} className="flex items-center justify-between p-4 3xl:p-10 bg-[#fff8f4] rounded-2xl border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-4 3xl:gap-8">
                          <img src={u.photos?.[0] || `https://ui-avatars.com/api/?name=${u.name}`} className="w-12 h-12 3xl:w-32 3xl:h-32 rounded-full object-cover border-2 border-white shadow-sm" />
                          <p className="font-bold 3xl:text-4xl text-gray-700">{u.name}</p>
                        </div>
                        <button 
                          onClick={() => handleUnblock(u._id)} 
                          className="text-rose-600 font-bold 3xl:text-3xl hover:underline underline-offset-4"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-10 border-t border-rose-50">
                <div className="p-8 3xl:p-16 bg-red-50 rounded-3xl border border-red-100">
                  <h4 className="text-red-900 font-bold 3xl:text-5xl mb-4 uppercase tracking-widest">Danger Zone</h4>
                  <p className="text-red-700/70 3xl:text-3xl mb-8 leading-relaxed">
                    Account deletion is permanent. All your matches, messages, and photos will be erased forever in accordance with our privacy policy.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-8 py-3 3xl:px-20 3xl:py-10 rounded-full font-bold 3xl:text-4xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 3xl:px-12 3xl:py-10 rounded-full transition-all font-bold 3xl:text-4xl ${active ? 'bg-[#6f2434] text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-rose-100'}`}
  >
    <span className="material-symbols-outlined 3xl:text-6xl">{icon}</span>
    {label}
  </button>
);

const InputGroup = ({ label, type, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-sm 3xl:text-3xl font-bold text-gray-700 ml-1">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#fbf9fa] border border-rose-50 rounded-2xl p-4 3xl:p-10 3xl:text-4xl focus:ring-2 focus:ring-rose-200 outline-none transition-all shadow-inner" 
    />
  </div>
);

const ToggleRow = ({ title, desc, icon, checked, onToggle }: any) => (
  <div className="flex items-center justify-between py-8 3xl:py-16">
    <div className="flex items-center gap-6 3xl:gap-12">
      <div className="w-14 h-14 3xl:w-28 3xl:h-28 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
        <span className="material-symbols-outlined 3xl:text-6xl">{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-xl 3xl:text-5xl text-gray-800">{title}</h4>
        <p className="text-sm 3xl:text-3xl text-gray-400">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className={`w-14 h-7 3xl:w-28 3xl:h-14 rounded-full relative transition-all duration-300 ${checked ? 'bg-rose-500' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-5 h-5 3xl:w-10 3xl:h-10 bg-white rounded-full transition-all duration-300 shadow-md ${checked ? 'left-8 3xl:left-16' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Settings;