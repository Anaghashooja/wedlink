import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract plan info if passed through state, else default to Gold
  const planName = location.state?.plan || "Premium";

  return (
    <div className="bg-[#fff8f4] min-h-screen flex flex-col selection:bg-rose-100">
      
      {/* 1. HEADER */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-rose-50 px-6 py-4 3xl:py-10">
        <div className="max-w-7xl 3xl:max-w-[2400px] mx-auto flex justify-between items-center">
          <div className="text-xl 3xl:text-5xl font-serif italic text-rose-900 font-bold">
            Wedlink <span className="text-rose-400 font-sans not-italic text-sm 3xl:text-3xl uppercase tracking-tighter">Matrimony</span>
          </div>
          <button onClick={() => navigate('/plans')} className="text-stone-500 hover:text-rose-500">
            <span className="material-symbols-outlined 3xl:text-5xl">close</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-12">
        <div className="max-w-xl 3xl:max-w-5xl w-full">
          
          {/* ASYMMETRIC VISUAL */}
          <div className="relative mb-12 3xl:mb-24 flex justify-center">
            <div className="absolute -top-6 -left-6 3xl:w-64 3xl:h-64 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 w-full aspect-[4/3] max-w-sm 3xl:max-w-2xl overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] shadow-2xl border-4 border-white">
              <img 
                alt="Interruption" 
                className="w-full h-full object-cover grayscale-[0.4]" 
                src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800" 
              />
              <div className="absolute inset-0 bg-[#6f2434]/10 mix-blend-multiply"></div>
            </div>
          </div>

          {/* CONTENT CARD */}
          <div className="bg-white rounded-[2rem] 3xl:rounded-[4rem] p-8 md:p-12 3xl:p-24 text-center shadow-xl border border-rose-50">
            <div className="mb-6 3xl:mb-12 inline-flex items-center justify-center w-16 h-16 3xl:w-32 3xl:h-32 rounded-full bg-red-50 text-red-500">
              <span className="material-symbols-outlined text-3xl 3xl:text-7xl" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
            </div>

            <h1 className="font-serif italic text-3xl md:text-4xl 3xl:text-8xl text-[#6f2434] mb-4">
              A brief interruption...
            </h1>
            <p className="text-gray-500 text-lg 3xl:text-4xl leading-relaxed mb-10 3xl:mb-20 max-w-md 3xl:max-w-3xl mx-auto">
              We were unable to finalize your {planName} membership at this moment. Don't worry, your progress is saved.
            </p>

            {/* ERROR REASON BENTO BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 3xl:gap-10 mb-12 3xl:mb-24">
              <div className="bg-[#fff8f4] p-6 3xl:p-12 rounded-2xl 3xl:rounded-[2rem] text-left border border-rose-50">
                <div className="flex items-center gap-3 mb-2 text-[#6f2434]">
                  <span className="material-symbols-outlined 3xl:text-4xl">account_balance_wallet</span>
                  <span className="text-[10px] 3xl:text-2xl font-bold uppercase tracking-widest">Possibility 01</span>
                </div>
                <p className="text-sm 3xl:text-3xl font-bold text-gray-800">Insufficient Funds</p>
                <p className="text-xs 3xl:text-2xl text-gray-500 mt-1">Please check your card balance.</p>
              </div>

              <div className="bg-[#fff8f4] p-6 3xl:p-12 rounded-2xl 3xl:rounded-[2rem] text-left border border-rose-50">
                <div className="flex items-center gap-3 mb-2 text-stone-400">
                  <span className="material-symbols-outlined 3xl:text-4xl">event_busy</span>
                  <span className="text-[10px] 3xl:text-2xl font-bold uppercase tracking-widest">Possibility 02</span>
                </div>
                <p className="text-sm 3xl:text-3xl font-bold text-gray-800">Connection Timeout</p>
                <p className="text-xs 3xl:text-2xl text-gray-500 mt-1">Bank servers may be busy.</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-4 3xl:gap-8">
              <button 
                onClick={() => navigate(-1)}
                className="w-full py-5 3xl:py-10 rounded-full bg-[#6f2434] text-white font-bold text-lg 3xl:text-5xl shadow-lg hover:bg-black transition-all active:scale-95"
              >
                Try Method Again
              </button>
              <button className="w-full py-3 text-[#6f2434] font-bold 3xl:text-4xl flex items-center justify-center gap-2 hover:underline">
                <span className="material-symbols-outlined 3xl:text-5xl">support_agent</span>
                Contact Support
              </button>
            </div>
          </div>

          <p className="text-center mt-8 3xl:mt-16 text-gray-400 text-xs 3xl:text-2xl uppercase tracking-[0.2em]">
            Securely handled by Wedlink Concierge
          </p>
        </div>
      </main>

      <footer className="py-10 border-t border-rose-50 text-center text-[10px] 3xl:text-xl text-gray-400 uppercase tracking-widest">
        © 2026 Wedlink Matrimony. All Rights Reserved.
      </footer>
    </div>
  );
};

export default PaymentFailed;