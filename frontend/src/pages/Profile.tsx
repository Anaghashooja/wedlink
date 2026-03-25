import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else navigate('/auth');
      } catch (err) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="text-center py-20 3xl:text-4xl">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-inter pb-20">
      {/* 1. Profile Header / Cover */}
      <div className="relative h-64 md:h-80 3xl:h-[600px] bg-rose-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
          <div className="relative">
            <img 
              src={user?.photos?.[0] || `https://ui-avatars.com/api/?name=${user?.name}&size=512`} 
              className="w-32 h-32 md:w-48 md:h-48 3xl:w-80 3xl:h-80 rounded-full border-4 border-white shadow-xl object-cover bg-white"
              alt="Profile"
            />
            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg text-rose-500 hover:text-rose-600">
              📸
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="max-w-7xl 3xl:max-w-[2200px] mx-auto mt-20 px-4 md:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8 3xl:gap-16">
        
        {/* Left: User Details Card */}
        <div className="lg:col-span-2 space-y-6 3xl:space-y-12">
          <div className="bg-white p-8 3xl:p-16 rounded-[2rem] 3xl:rounded-[3rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl 3xl:text-7xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-rose-500 font-semibold 3xl:text-3xl mt-1">{user?.profession || 'Update Profession'}</p>
              </div>
              <button className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-2 3xl:px-10 3xl:py-4 3xl:text-2xl rounded-xl font-bold hover:bg-rose-500 hover:text-white transition">
                Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 3xl:gap-10 border-t pt-8">
              <DetailItem label="Email" value={user?.email} />
              <DetailItem label="Religion" value={user?.religion || 'Not Set'} />
              <DetailItem label="Mother Tongue" value={user?.motherTongue || 'Not Set'} />
              <DetailItem label="Gender" value={user?.gender} />
              <DetailItem label="Annual Income" value={user?.annualIncome || 'Not Set'} />
              <DetailItem label="Member Since" value={new Date(user?.date).toLocaleDateString()} />
            </div>
          </div>
        </div>

        {/* Right: Photos Management */}
        <div className="space-y-6">
          <div className="bg-white p-6 3xl:p-12 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl 3xl:text-4xl font-bold text-gray-800 mb-6">My Gallery ({user?.photos?.length || 0}/6)</h3>
            <div className="grid grid-cols-3 gap-3 3xl:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-xl 3xl:rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group">
                  {user?.photos?.[i] ? (
                    <img src={user.photos[i]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 text-2xl 3xl:text-5xl">+</div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-gray-900 text-white py-3 3xl:py-6 rounded-xl 3xl:text-2xl font-bold hover:bg-gray-800 transition">
              Manage Photos
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Detail Component
const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-gray-400 text-xs 3xl:text-2xl uppercase tracking-wider font-bold mb-1">{label}</p>
    <p className="text-gray-800 font-medium md:text-lg 3xl:text-3xl">{value}</p>
  </div>
);

export default Profile;