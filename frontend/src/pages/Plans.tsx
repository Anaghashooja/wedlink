import React from 'react';
import { useNavigate } from 'react-router-dom';

const Plans: React.FC = () => {
  const navigate = useNavigate();

  // Logic: Send to matches if free, otherwise send to checkout
  const handleUpgrade = (plan: string) => {
    if (plan === 'Free') {
      navigate('/matches');
    } else {
      navigate(`/checkout/${plan}`);
    }
  };

  return (
    <div className="bg-[#fff8f4] min-h-screen font-inter pb-20 selection:bg-rose-100">
      <main className="pt-28 pb-32 max-w-7xl 3xl:max-w-[2400px] mx-auto px-6">
        
        {/* HERO SECTION */}
        <section className="text-center mb-20 3xl:mb-40">
          <h1 className="font-serif italic text-4xl md:text-6xl 3xl:text-[9rem] text-[#6f2434] mb-6 leading-tight">
            Find Your Perfect Path <br className="hidden md:block" /> to Forever.
          </h1>
          <p className="text-gray-600 max-w-2xl 3xl:max-w-6xl mx-auto text-lg 3xl:text-4xl leading-relaxed opacity-80">
            Choose a plan designed to honor your journey. From initial discovery to meaningful unions, we offer the tools to help you find your lifelong partner.
          </p>
        </section>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 3xl:gap-16 items-stretch">
          
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
          <div className="relative bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-2xl border-t-8 border-[#775a19] flex flex-col h-full lg:scale-105 z-10 transition-all duration-500 hover:scale-110">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#775a19] text-white px-8 py-2 3xl:px-16 3xl:py-5 rounded-full text-xs 3xl:text-3xl font-bold uppercase tracking-[0.2em] shadow-lg">
              Recommended
            </div>
            <div className="mb-8 3xl:mb-20">
              <h3 className="font-serif text-3xl 3xl:text-7xl text-gray-900 mb-2">Gold Member</h3>
              <p className="text-gray-500 text-sm 3xl:text-3xl italic">The most popular choice for serious seekers</p>
              <div className="mt-8 3xl:mt-16 flex items-baseline gap-1">
                <span className="text-xl 3xl:text-5xl font-bold text-[#6f2434]">$</span>
                <span className="text-6xl 3xl:text-[12rem] font-bold text-[#6f2434] tracking-tighter">29</span>
                <span className="text-gray-400 text-sm 3xl:text-3xl">/month</span>
              </div>
            </div>
            <ul className="space-y-5 3xl:space-y-12 mb-12 flex-grow">
              <FeatureItem text="50 Interests Daily" highlight />
              <FeatureItem text="Boost Your Profile (1x/mo)" highlight />
              <FeatureItem text="See Common Interests" highlight />
              <FeatureItem text="Unlimited Chat Access" highlight />
            </ul>
            <button 
              onClick={() => handleUpgrade('Gold')}
              className="w-full py-5 3xl:py-12 rounded-full font-bold text-white bg-gradient-to-br from-[#6f2434] to-[#8d3b4a] shadow-xl hover:shadow-rose-900/20 transition-all 3xl:text-5xl active:scale-95"
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

        {/* TRUST FOOTER */}
        <div className="mt-32 3xl:mt-60 text-center opacity-40 grayscale group hover:grayscale-0 transition-all">
             <p className="font-serif italic text-2xl 3xl:text-6xl text-stone-400">Trusted by over 10,000 successful unions worldwide</p>
        </div>

      </main>
    </div>
  );
};

// HELPER COMPONENTS
const PlanCard = ({ title, price, tagline, features, buttonText, isDiamond, onClick }: any) => (
  <div className="bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-lg border border-rose-100 flex flex-col h-full hover:translate-y-[-12px] transition-all duration-500">
    <div className="mb-8 3xl:mb-20">
      <h3 className="font-serif text-3xl 3xl:text-7xl text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm 3xl:text-3xl italic">{tagline}</p>
      <div className="mt-8 3xl:mt-16 flex items-baseline gap-1">
        {price !== "Free" && <span className="text-xl 3xl:text-5xl font-bold text-[#6f2434]">$</span>}
        <span className={`${price === "Free" ? 'text-5xl 3xl:text-9xl' : 'text-6xl 3xl:text-[11rem]'} font-bold text-[#6f2434] tracking-tighter`}>{price}</span>
        {price !== "Free" && <span className="text-gray-400 text-sm 3xl:text-3xl">/month</span>}
      </div>
    </div>
    <ul className="space-y-5 3xl:space-y-12 mb-12 flex-grow">
      {features.map((f: string) => <FeatureItem key={f} text={f} />)}
    </ul>
    <button 
      onClick={onClick}
      className={`w-full py-5 3xl:py-12 rounded-full font-bold transition-all 3xl:text-5xl active:scale-95 shadow-md ${
      isDiamond 
        ? 'bg-gray-900 text-white hover:bg-black' 
        : 'border-2 border-[#6f2434] text-[#6f2434] hover:bg-rose-50'
    }`}>
      {buttonText}
    </button>
  </div>
);

const FeatureItem = ({ text, highlight }: { text: string, highlight?: boolean }) => (
  <li className="flex items-start gap-4">
    <span className={`material-symbols-outlined text-2xl 3xl:text-6xl ${highlight ? 'text-[#775a19]' : 'text-rose-300'}`} style={{fontVariationSettings: "'FILL' 1"}}>
      {highlight ? 'stars' : 'check_circle'}
    </span>
    <span className={`${highlight ? 'text-gray-900 font-bold' : 'text-gray-500'} text-base 3xl:text-4xl leading-tight`}>{text}</span>
  </li>
);

export default Plans;