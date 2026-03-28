import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async (plan: string) => {
    if (plan === 'Free') return navigate('/matches');
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/membership/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan })
      });
      
      if (res.ok) {
        alert(`Congratulations! You are now a ${plan} member.`);
        navigate('/profile');
      }
    } catch (err) {
      alert("Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fff8f4] min-h-screen font-inter pb-20">
      <main className="pt-28 pb-32 max-w-7xl 3xl:max-w-[2400px] mx-auto px-6">
        
        {/* HERO SECTION */}
        <section className="text-center mb-20 3xl:mb-40">
          <h1 className="font-serif italic text-4xl md:text-6xl 3xl:text-[9rem] text-[#6f2434] mb-6">
            Find Your Perfect Path to Forever.
          </h1>
          <p className="text-gray-600 max-w-2xl 3xl:max-w-6xl mx-auto text-lg 3xl:text-4xl leading-relaxed">
            Choose a plan designed to honor your journey. From initial discovery to meaningful unions, we offer the tools to help you find your lifelong partner.
          </p>
        </section>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 3xl:gap-16 items-end">
          
          {/* FREE PLAN */}
          <PlanCard 
            title="Start Your Journey"
            price="Free"
            tagline="The basics for exploring"
            features={["Profile Creation", "5 Interests Daily", "Standard Support"]}
            buttonText="Get Started"
            onClick={() => handleUpgrade('Free')}
          />

          {/* GOLD PLAN (RECOMMENDED) */}
          <div className="relative bg-white p-8 3xl:p-20 rounded-3xl shadow-xl border-t-4 border-[#775a19] flex flex-col h-full lg:scale-105 z-10 transition-transform hover:scale-110">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#775a19] text-white px-6 py-1 3xl:px-12 3xl:py-3 rounded-full text-xs 3xl:text-2xl font-bold uppercase tracking-widest">
              Recommended
            </div>
            <div className="mb-8 3xl:mb-16">
              <h3 className="font-serif text-2xl 3xl:text-6xl text-gray-900 mb-2">Gold Member</h3>
              <p className="text-gray-500 text-sm 3xl:text-2xl italic">The most popular choice</p>
              <div className="mt-6 3xl:mt-12 flex items-baseline gap-1">
                <span className="text-lg 3xl:text-4xl font-bold text-[#6f2434]">$</span>
                <span className="text-5xl 3xl:text-9xl font-bold text-[#6f2434]">29</span>
                <span className="text-gray-400 text-sm 3xl:text-2xl">/month</span>
              </div>
            </div>
            <ul className="space-y-4 3xl:space-y-10 mb-10 flex-grow">
              <FeatureItem text="50 Interests Daily" highlight />
              <FeatureItem text="Boost Your Profile (1x/mo)" highlight />
              <FeatureItem text="See Common Interests" highlight />
              <FeatureItem text="Limited Chat Access" highlight />
            </ul>
            <button 
              onClick={() => handleUpgrade('Gold')}
              className="w-full py-4 3xl:py-10 rounded-full font-bold text-white bg-gradient-to-br from-[#6f2434] to-[#8d3b4a] shadow-lg hover:opacity-90 transition-all 3xl:text-4xl active:scale-95"
            >
              Upgrade to Gold
            </button>
          </div>

          {/* DIAMOND PLAN */}
          <PlanCard 
            title="The Ultimate Union"
            price="89"
            tagline="Elite concierge experience"
            features={["Unlimited Interests", "Weekly Profile Boost", "Direct Contact Details", "Unlimited Messages", "Relationship Advisor"]}
            buttonText="Go Elite"
            isDiamond
            onClick={() => handleUpgrade('Diamond')}
          />
        </div>

      </main>
    </div>
  );
};

// HELPER COMPONENTS
const PlanCard = ({ title, price, tagline, features, buttonText, isDiamond, onClick }: any) => (
  <div className="bg-white p-8 3xl:p-20 rounded-3xl shadow-sm border border-rose-50 flex flex-col h-full hover:translate-y-[-8px] transition-all duration-300">
    <div className="mb-8 3xl:mb-16">
      <h3 className="font-serif text-2xl 3xl:text-6xl text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm 3xl:text-2xl italic">{tagline}</p>
      <div className="mt-6 3xl:mt-12 flex items-baseline gap-1">
        {price !== "Free" && <span className="text-lg 3xl:text-4xl font-bold text-[#6f2434]">$</span>}
        <span className={`${price === "Free" ? 'text-4xl 3xl:text-8xl' : 'text-5xl 3xl:text-9xl'} font-bold text-[#6f2434]`}>{price}</span>
        {price !== "Free" && <span className="text-gray-400 text-sm 3xl:text-2xl">/month</span>}
      </div>
    </div>
    <ul className="space-y-4 3xl:space-y-10 mb-10 flex-grow">
      {features.map((f: string) => <FeatureItem key={f} text={f} />)}
    </ul>
    <button 
      onClick={onClick}
      className={`w-full py-4 3xl:py-10 rounded-full font-bold transition-all 3xl:text-4xl active:scale-95 ${
      isDiamond ? 'bg-gray-900 text-white hover:bg-black' : 'border-2 border-[#6f2434] text-[#6f2434] hover:bg-rose-50'
    }`}>
      {buttonText}
    </button>
  </div>
);

const FeatureItem = ({ text, highlight }: { text: string, highlight?: boolean }) => (
  <li className="flex items-start gap-3">
    <span className={`material-symbols-outlined text-xl 3xl:text-5xl ${highlight ? 'text-[#775a19]' : 'text-[#6f2434]'}`}>
      {highlight ? 'stars' : 'check_circle'}
    </span>
    <span className={`${highlight ? 'text-gray-900 font-semibold' : 'text-gray-500'} 3xl:text-3xl`}>{text}</span>
  </li>
);

export default Plans;