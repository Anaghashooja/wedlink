import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const { plan } = useParams(); // 'Gold' or 'Diamond'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });

  // Plan Data Mapping
  const planInfo: any = {
    Gold: { price: "29.00", features: ["50 Interests Daily", "Profile Boost 1x", "Limited Chat"] },
    Diamond: { price: "89.00", features: ["Unlimited Interests", "Direct Contact Details", "Relationship Advisor"] }
  };

  const currentPlan = planInfo[plan as string] || planInfo.Gold;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/membership/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ planType: plan, paymentDetails: formData })
      });
      
      const data = await res.json();
     if (res.ok) {
    // Instead of /profile, go to the success page
    navigate('/payment-success');
}
    } catch (err) {
      // Redirect to failure page with plan info
      navigate('/payment-failed', { state: { plan: plan } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fff8f4] min-h-screen font-inter pb-20">
      {/* 1. HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-rose-50 px-6 py-4 3xl:py-10">
        <div className="max-w-7xl 3xl:max-w-[2400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-stone-400 hover:text-rose-500"><span className="material-symbols-outlined 3xl:text-5xl">arrow_back</span></button>
            <h1 className="text-xl 3xl:text-5xl font-serif italic text-rose-900 font-bold">Secure Checkout</h1>
          </div>
          <img src="/logo.png" className="h-10 3xl:h-20" alt="Wedlink" />
        </div>
      </header>

      <main className="pt-12 3xl:pt-32 px-6 max-w-6xl 3xl:max-w-[2200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 3xl:gap-24">
          
          {/* LEFT COLUMN: PAYMENT FORM */}
          <div className="lg:col-span-7 space-y-10 3xl:space-y-20">
            <section>
              <h2 className="text-3xl md:text-5xl 3xl:text-9xl font-serif italic text-[#6f2434] mb-2">Complete Your Union</h2>
              <p className="text-gray-500 3xl:text-4xl">Enter your payment details below to unlock exclusive {plan} features.</p>
            </section>

            <form onSubmit={handlePayment} className="space-y-6 3xl:space-y-12">
              {/* Trust Badges */}
              <div className="flex gap-4">
                 <Badge text="SSL Secure" icon="verified_user" />
                 <Badge text="PCI Compliant" icon="encrypted" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 3xl:gap-12">
                <div className="md:col-span-2">
                  <label className="auth-label">Card Information</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="auth-input" required onChange={(e)=>setFormData({...formData, cardNumber: e.target.value})} />
                </div>
                <div>
                  <label className="auth-label">Expiry Date</label>
                  <input type="text" placeholder="MM / YY" className="auth-input" required onChange={(e)=>setFormData({...formData, expiry: e.target.value})} />
                </div>
                <div>
                  <label className="auth-label">CVV</label>
                  <input type="password" placeholder="•••" className="auth-input" required onChange={(e)=>setFormData({...formData, cvv: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#6f2434] text-white font-bold py-5 3xl:py-12 rounded-full shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 3xl:text-5xl"
              >
                {loading ? "Processing..." : `Pay $${currentPlan.price} Now`}
                <span className="material-symbols-outlined">lock</span>
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 3xl:p-20 rounded-[2.5rem] 3xl:rounded-[4rem] shadow-xl border border-rose-50 relative overflow-hidden">
              <h3 className="text-xl 3xl:text-6xl font-serif italic text-[#6f2434] mb-8 border-b pb-4">Order Summary</h3>
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-xl 3xl:text-5xl font-bold text-gray-900">{plan} Membership</p>
                  <p className="text-sm 3xl:text-3xl text-gray-400 italic">Monthly Access Plan</p>
                </div>
                <p className="text-2xl 3xl:text-6xl font-serif text-[#6f2434] font-bold">${currentPlan.price}</p>
              </div>

              <div className="space-y-4 3xl:space-y-10 mb-10">
                {currentPlan.features.map((f: string) => (
                  <div key={f} className="flex items-center gap-3 text-sm 3xl:text-3xl text-gray-600">
                    <span className="material-symbols-outlined text-rose-500 text-lg 3xl:text-5xl">check_circle</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-8 space-y-4 3xl:space-y-8">
                <div className="flex justify-between 3xl:text-4xl text-gray-500">
                  <span>Subtotal</span>
                  <span>${currentPlan.price}</span>
                </div>
                <div className="flex justify-between text-xl 3xl:text-6xl font-bold text-gray-900 pt-4 border-t">
                  <span>Total Due</span>
                  <span>${currentPlan.price}</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-rose-900 p-8 3xl:p-16 rounded-[2rem] text-white">
                <p className="font-serif italic text-lg 3xl:text-4xl leading-relaxed opacity-90">
                    "Upgrading to {plan} was the best decision. I found more verified profiles and connected with my partner within a week!"
                </p>
                <p className="mt-4 text-xs 3xl:text-2xl font-bold uppercase tracking-widest text-rose-300">— Rahul S., Verified Member</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const Badge = ({ text, icon }: any) => (
    <div className="flex items-center gap-2 px-3 py-1.5 3xl:px-8 3xl:py-4 rounded-lg bg-white border border-rose-100 shadow-sm">
        <span className="material-symbols-outlined text-rose-500 text-sm 3xl:text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
        <span className="text-[10px] 3xl:text-2xl uppercase tracking-widest font-bold text-gray-500">{text}</span>
    </div>
);

export default Checkout;