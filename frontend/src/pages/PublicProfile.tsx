import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

const PublicProfile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
const [requestSent, setRequestSent] = useState(false);
const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/auth/user/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  const handleConnect = async () => {
  setBtnLoading(true);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/requests/send/${id}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setRequestSent(true);
      alert("Success: Your interest has been sent!");
    } else {
      alert(data.msg || "Failed to send request");
    }
  } catch (err) {
    alert("Connection error");
  } finally {
    setBtnLoading(false);
  }
};

  if (loading) return <div className="h-screen flex items-center justify-center 3xl:text-4xl text-rose-500 font-bold">Loading Profile...</div>;
  if (!user) return <div className="text-center py-20">User not found</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-inter">
      
      {/* LEFT SIDE (40%): Image Gallery - STICKY on Desktop */}
      <div className="lg:w-[40%] h-[50vh] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 bg-gray-100 overflow-hidden group">
        <img 
          src={user.photos?.[activeImg] || `https://ui-avatars.com/api/?name=${user.name}&size=1000`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Main"
        />
        
        {/* Thumbnail Navigation Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 3xl:gap-6 bg-black/20 backdrop-blur-md p-3 rounded-2xl">
          {user.photos?.map((img: string, index: number) => (
            <button 
              key={index} 
              onClick={() => setActiveImg(index)}
              className={`w-12 h-12 3xl:w-24 3xl:h-24 rounded-lg border-2 transition-all overflow-hidden ${activeImg === index ? 'border-rose-500 scale-110' : 'border-transparent opacity-70'}`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (60%): Detailed Biography - SCROLLABLE */}
      <div className="lg:w-[60%] p-8 md:p-16 3xl:p-32 space-y-12 3xl:space-y-24 overflow-y-auto">
        
        {/* 1. Basic Header */}
        <div className="flex justify-between items-start border-b pb-10">
          <div>
            <h1 className="text-4xl md:text-6xl 3xl:text-9xl font-bold text-gray-900 font-k2d">{user.name}</h1>
            <p className="text-xl 3xl:text-4xl text-rose-500 font-semibold mt-2">{user.profession} • {user.religion}</p>
            <div className="flex items-center mt-4 text-gray-500 3xl:text-3xl">
              <span>📍 {user.location || 'Mumbai, India'}</span>
              <span className="mx-3">•</span>
              <span>🎂 {user.age || '26'} Years Old</span>
            </div>
          </div>
         <button 
  onClick={handleConnect}
  disabled={requestSent || btnLoading}
  className={`${
    requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
  } text-white px-10 py-4 3xl:px-20 3xl:py-10 rounded-2xl 3xl:rounded-[3rem] font-bold text-xl 3xl:text-5xl shadow-xl transition-all active:scale-95`}
>
  {btnLoading ? "Processing..." : requestSent ? "Interest Sent" : "Connect Now"}
</button>
        </div>

        {/* 2. About Section */}
        <section className="space-y-4 3xl:space-y-10">
          <h2 className="text-2xl 3xl:text-5xl font-bold text-gray-800 uppercase tracking-widest">About Me</h2>
          <p className="text-gray-600 text-lg 3xl:text-4xl leading-relaxed">
            {user.bio || `I am a ${user.profession} who values tradition and family. I'm looking for a partner who is kind-hearted, ambitious, and shares similar values. In my free time, I enjoy traveling, exploring new cuisines, and spending quality time with my loved ones.`}
          </p>
        </section>

        {/* 3. Detailed Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 3xl:gap-20">
          <InfoCard title="Education" value={user.education || "Master's Degree"} icon="🎓" />
          <InfoCard title="Annual Income" value={user.annualIncome || "₹ 15-20 Lakhs"} icon="💰" />
          <InfoCard title="Mother Tongue" value={user.motherTongue} icon="🗣️" />
          <InfoCard title="Diet" value={user.diet || "Vegetarian"} icon="🥗" />
          <InfoCard title="Height" value={user.height || "5' 8\""} icon="📏" />
          <InfoCard title="Caste" value={user.caste || "Not Specified"} icon="🤝" />
        </section>

        {/* 4. Family Details */}
        <section className="bg-rose-50 p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] space-y-6">
          <h2 className="text-2xl 3xl:text-5xl font-bold text-rose-800">Family Background</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 3xl:gap-12 text-rose-700 3xl:text-3xl">
            <p><strong>Father:</strong> Retired Professional</p>
            <p><strong>Mother:</strong> Homemaker</p>
            <p><strong>Siblings:</strong> 1 Brother (Married)</p>
            <p><strong>Family Values:</strong> Traditional/Liberal</p>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex gap-4 pt-10">
          <button className="flex-grow border-2 border-rose-500 text-rose-500 py-4 3xl:py-10 rounded-2xl 3xl:rounded-[3rem] font-bold 3xl:text-4xl hover:bg-rose-50 transition">
            Save Profile ❤️
          </button>
          <button className="flex-grow border-2 border-gray-200 text-gray-500 py-4 3xl:py-10 rounded-2xl 3xl:rounded-[3rem] font-bold 3xl:text-4xl hover:bg-gray-50 transition">
            Report Profile 🚩
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean mapping
const InfoCard = ({ title, value, icon }: any) => (
  <div className="flex items-center gap-4 p-6 3xl:p-12 bg-white border border-gray-100 rounded-3xl shadow-sm">
    <div className="text-3xl 3xl:text-6xl">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs 3xl:text-2xl uppercase font-bold tracking-tighter">{title}</p>
      <p className="text-gray-800 text-xl 3xl:text-4xl font-semibold">{value}</p>
    </div>
  </div>
);

export default PublicProfile;