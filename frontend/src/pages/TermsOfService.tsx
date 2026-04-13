import React, { useEffect, useState } from 'react';

const TermsOfService: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/terms')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  const navLinks = data?.sections || [];

  return (
    <div className="bg-[#fff8f4] min-h-screen font-inter selection:bg-rose-100">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-4xl 3xl:max-w-7xl mx-auto px-8 pt-24 pb-16 3xl:pt-48 3xl:pb-32 text-center">
        <h1 className="font-serif italic text-5xl md:text-7xl 3xl:text-[10rem] text-[#6f2434] mb-6 tracking-tight">
          Terms of <span className="not-italic text-rose-500">Service</span>
        </h1>
        <p className="text-gray-500 text-lg 3xl:text-5xl max-w-2xl 3xl:max-w-6xl mx-auto leading-relaxed">
          Our commitment to fostering a safe, respectful, and elevated environment for connection. 
          <br/>Last updated: <span className="font-bold text-rose-900">{data?.lastUpdated || '2024'}</span>
        </p>
      </section>

      <div className="max-w-7xl 3xl:max-w-[2400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 3xl:gap-32">
        
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 3xl:top-52 space-y-4 3xl:space-y-12">
            <h3 className="text-[10px] 3xl:text-2xl font-bold tracking-[0.3em] uppercase text-stone-400 mb-6">Navigation</h3>
            <ul className="space-y-4 3xl:space-y-10">
              {navLinks.map((section: any) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`} 
                    className="text-stone-500 hover:text-rose-600 3xl:text-4xl font-medium transition-all block border-l-2 border-transparent hover:border-rose-500 pl-4"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 3. CONTENT SECTIONS */}
        <div className="lg:col-span-9 space-y-24 3xl:space-y-60 pb-32">
          
          <TermsSection id="acceptance" number="01" title="Acceptance of Terms">
            <p className="text-lg 3xl:text-5xl leading-relaxed text-gray-700">
              By accessing or using <span className="font-serif italic text-rose-900">Wedlink Matrimony</span>, you enter into a binding legal agreement. This document outlines your rights and responsibilities. If you do not agree to these terms, please refrain from using our services.
            </p>
            <p className="3xl:text-4xl leading-relaxed text-gray-500">
              We reserve the right to modify these terms at any time. Significant changes will be communicated via the email address associated with your account.
            </p>
          </TermsSection>

          <TermsSection id="eligibility" number="02" title="User Eligibility">
            <div className="grid md:grid-cols-2 gap-8 3xl:gap-20">
              <Bullet title="Age Requirement" desc="You must be at least 18 years of age to participate in our community." />
              <Bullet title="Marital Status" desc="You represent that you are legally single, divorced, or widowed." />
              <Bullet title="Verification" desc="We reserve the right to request proof of identity to maintain ecosystem integrity." />
              <Bullet title="Compliance" desc="You must not have been convicted of any felony or crime involving violence." />
            </div>
          </TermsSection>

          <TermsSection id="conduct" number="03" title="Code of Conduct">
            <div className="bg-rose-900 p-8 3xl:p-20 rounded-[2rem] 3xl:rounded-[4rem] text-white mb-10 shadow-2xl">
               <p className="font-serif italic text-2xl 3xl:text-6xl">"Grace, respect, and authenticity are the pillars of our union."</p>
            </div>
            <p className="text-gray-600 3xl:text-4xl leading-relaxed">
              Any form of bullying, hate speech, stalking, or unwanted aggressive behavior will result in immediate and permanent account suspension without refund.
            </p>
          </TermsSection>

          <TermsSection id="subscription" number="04" title="Subscription Terms">
             <p className="text-gray-600 3xl:text-4xl leading-relaxed mb-8">
               Our membership tiers are designed to provide varying levels of access to our concierge matching and community features.
             </p>
             <ul className="space-y-4 3xl:space-y-10">
                <li className="flex items-center gap-3 3xl:text-4xl text-stone-500"><span className="text-rose-500 material-symbols-outlined 3xl:text-5xl">check_circle</span> Subscriptions renew automatically.</li>
                <li className="flex items-center gap-3 3xl:text-4xl text-stone-500"><span className="text-rose-500 material-symbols-outlined 3xl:text-5xl">check_circle</span> Refunds are granted only within 48 hours.</li>
             </ul>
          </TermsSection>

        </div>
      </div>
    </div>
  );
};

// HELPERS
const TermsSection = ({ id, number, title, children }: any) => (
  <section id={id} className="scroll-mt-32">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-px w-12 3xl:w-24 bg-rose-200"></div>
      <span className="text-rose-500 font-bold uppercase tracking-widest text-[10px] 3xl:text-2xl">Section {number}</span>
    </div>
    <h2 className="font-serif text-3xl md:text-4xl 3xl:text-8xl text-gray-900 mb-8">{title}</h2>
    <div className="bg-white p-8 3xl:p-20 rounded-3xl 3xl:rounded-[4rem] shadow-xl shadow-rose-900/5 space-y-6">
      {children}
    </div>
  </section>
);

const Bullet = ({ title, desc }: any) => (
  <div className="space-y-2">
    <h4 className="font-bold text-gray-800 3xl:text-4xl">{title}</h4>
    <p className="text-sm 3xl:text-3xl text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default TermsOfService;