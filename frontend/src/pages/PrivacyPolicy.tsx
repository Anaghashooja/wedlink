import React, { useEffect, useState } from 'react';

const PrivacyPolicy: React.FC = () => {
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/policy')
      .then(res => res.json())
      .then(data => setMeta(data));
  }, []);

  return (
    <div className="bg-[#fff8f4] min-h-screen pb-32 selection:bg-rose-100">
      
      {/* 1. EDITORIAL HEADER */}
      <header className="pt-24 pb-16 3xl:pt-48 3xl:pb-32 text-center px-6">
        <p className="text-rose-600 font-bold tracking-[0.3em] uppercase text-[10px] 3xl:text-3xl mb-4">Integrity & Privacy</p>
        <h1 className="text-5xl md:text-6xl 3xl:text-[11rem] font-serif italic text-[#6f2434] leading-tight mb-8">
          Our Commitment to <br/> Your <span className="not-italic text-rose-500">*Privacy*</span>
        </h1>
        <p className="text-gray-500 text-lg 3xl:text-5xl max-w-2xl 3xl:max-w-6xl mx-auto leading-relaxed">
          Trust is the foundation of any union. We handle your data with the same care and discretion as a trusted confidant.
        </p>
        <div className="mt-12 flex justify-center items-center gap-6 3xl:gap-12">
          <div className="h-px w-12 3xl:w-32 bg-rose-200"></div>
          <span className="text-xs 3xl:text-2xl text-stone-400 font-medium italic">Last updated {meta?.lastUpdated || '2026'}</span>
          <div className="h-px w-12 3xl:w-32 bg-rose-200"></div>
        </div>
      </header>

      <main className="max-w-4xl 3xl:max-w-7xl mx-auto px-6 space-y-12 3xl:space-y-32">
        
        {/* SECTION: DATA COLLECTION */}
        <section className="p-10 3xl:p-24 bg-white rounded-[2.5rem] 3xl:rounded-[5rem] shadow-xl shadow-rose-900/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#6f2434] to-rose-400"></div>
          <div className="flex flex-col md:flex-row gap-10 3xl:gap-24">
            <div className="md:w-1/3">
              <h2 className="text-3xl 3xl:text-7xl font-serif italic text-[#6f2434]">Data Collection</h2>
              <div className="mt-4 flex items-center gap-2 text-rose-300 font-bold">
                <span className="material-symbols-outlined 3xl:text-5xl">shield</span>
                <span className="text-[10px] 3xl:text-2xl uppercase tracking-widest">Purposeful gathering</span>
              </div>
            </div>
            <div className="md:w-2/3 text-gray-600 leading-relaxed space-y-6 3xl:text-4xl">
              <p>To facilitate meaningful connections, we collect information that helps us understand your personality and values.</p>
              <ul className="space-y-4 3xl:space-y-10">
                <PolicyItem title="Personal Identity" desc="Full name, DOB, and gender to ensure authentic profiles." />
                <PolicyItem title="Lifestyle Details" desc="Hobbies, education, and career aspirations shared by you." />
                <PolicyItem title="Visual Media" desc="Photographs are stored with enterprise-grade encryption." />
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: DATA SECURITY (Visual Focus) */}
        <section className="relative rounded-[3rem] 3xl:rounded-[6rem] overflow-hidden min-h-[300px] 3xl:min-h-[700px] flex items-center shadow-2xl">
          <img 
            alt="Security" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] contrast-125" 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" 
          />
          <div className="absolute inset-0 bg-[#6f2434]/85 backdrop-blur-sm"></div>
          <div className="relative z-10 p-10 md:p-20 3xl:p-40 text-white">
            <h2 className="text-3xl 3xl:text-8xl font-serif italic mb-6">Military-Grade Security</h2>
            <p className="text-rose-100 max-w-2xl 3xl:max-w-5xl leading-relaxed text-lg 3xl:text-5xl">
              We employ AES-256 encryption for all data at rest. Your private conversations and documents are shielded by multiple layers of digital architecture.
            </p>
          </div>
        </section>

        {/* SECTION: GDPR */}
        <section className="p-10 3xl:p-24 bg-stone-100 rounded-[2.5rem] 3xl:rounded-[5rem]">
          <div className="flex flex-col md:flex-row gap-10 3xl:gap-24">
            <div className="md:w-1/3">
              <h2 className="text-3xl 3xl:text-7xl font-serif italic text-stone-800">Your Rights</h2>
              <p className="text-xs 3xl:text-3xl text-stone-400 mt-4 leading-relaxed">Full control over your digital footprint.</p>
            </div>
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 3xl:gap-10">
                <RightCard title="Right to Access" icon="visibility" />
                <RightCard title="Right to Erasure" icon="delete_forever" />
                <RightCard title="Data Portability" icon="move_up" />
                <RightCard title="Rectification" icon="edit_square" />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER CALLOUT */}
      <footer className="mt-20 3xl:mt-40 text-center px-6">
          <p className="text-stone-400 text-sm 3xl:text-4xl italic">
            Questions regarding your privacy? Contact our Officer at <span className="text-rose-600 font-bold underline underline-offset-4">privacy@wedlink.com</span>
          </p>
      </footer>
    </div>
  );
};

// HELPERS
const PolicyItem = ({ title, desc }: any) => (
  <li className="flex gap-4 items-start">
    <span className="material-symbols-outlined text-rose-500 3xl:text-5xl mt-1">check_circle</span>
    <span><strong className="text-gray-800">{title}:</strong> {desc}</span>
  </li>
);

const RightCard = ({ title, icon }: any) => (
  <div className="flex items-center gap-4 p-5 3xl:p-12 bg-white rounded-2xl shadow-sm border border-stone-200/50 hover:border-rose-200 transition-colors group">
    <span className="text-[#6f2434] material-symbols-outlined 3xl:text-6xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-sm 3xl:text-4xl font-bold text-stone-700">{title}</span>
  </div>
);

export default PrivacyPolicy;