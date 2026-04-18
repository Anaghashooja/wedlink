import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/membership/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) setData(result);
      } catch (err) {
        console.error("Error fetching status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);
  const handleDownloadReceipt = async () => {
  try {
    const token = localStorage.getItem('token');
    const transactionId = data?.transactionId || "latest";
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/membership/receipt/${transactionId}`,
      {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      }
    );

    if (!response.ok) throw new Error('Download failed');

    // Convert response to blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link and trigger click
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt-${transactionId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading receipt:", err);
    alert("Could not download receipt. Please try again later.");
  }
};


  if (loading) return <div className="h-screen flex items-center justify-center 3xl:text-6xl text-rose-500">Confirming your union...</div>;

  return (
    <div className="bg-[#fff8f4] min-h-screen pb-32 selection:bg-rose-100">
      <main className="pt-24 3xl:pt-48 pb-32 flex flex-col items-center max-w-7xl 3xl:max-w-[2400px] mx-auto px-6">
        
        {/* HERO IMAGE SECTION */}
        <div className="relative w-full max-w-4xl 3xl:max-w-7xl mb-16 3xl:mb-32">
          <div className="asymmetric-image-container overflow-hidden w-full h-[320px] md:h-[450px] 3xl:h-[800px] shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200" 
              className="w-full h-full object-cover" 
              alt="Celebration" 
            />
          </div>
          
          {/* FLOATING CONFIRMATION BADGE */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl px-10 py-5 3xl:px-20 3xl:py-10 rounded-2xl 3xl:rounded-[3rem] shadow-2xl border border-white/30 flex items-center gap-4">
            <span className="material-symbols-outlined text-green-500 text-3xl 3xl:text-7xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            <span className="font-serif italic text-[#6f2434] text-xl 3xl:text-5xl font-bold">Transaction Confirmed</span>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <section className="text-center mb-16 3xl:mb-32 space-y-6">
          <h1 className="font-serif italic text-4xl md:text-6xl 3xl:text-[10rem] text-[#6f2434] leading-tight">
            Your <span className="text-rose-500">Journey</span> Begins
          </h1>
          <p className="text-gray-600 text-lg 3xl:text-5xl max-w-2xl 3xl:max-w-6xl mx-auto leading-relaxed">
            Welcome to the union of tradition and modernity. Your {data?.plan} membership has been activated, and a world of curated connections awaits you.
          </p>
        </section>

        {/* DETAILS GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 3xl:gap-20 mb-16 3xl:mb-32">
          
          {/* Subscription Card */}
          <div className="bg-white p-8 3xl:p-20 rounded-[2rem] 3xl:rounded-[4rem] shadow-xl border border-rose-50 flex flex-col justify-between">
            <h3 className="font-serif text-2xl 3xl:text-6xl text-[#6f2434] mb-8 border-b border-rose-50 pb-4">Subscription Details</h3>
            <div className="space-y-4 3xl:space-y-10">
              <Row label="Plan" value={`${data?.plan} Membership`} bold />
              <Row label="Billing Cycle" value="Monthly" />
              <Row label="Transaction ID" value={data?.transactionId} mono />
              <div className="pt-6 mt-6 border-t border-rose-50 flex justify-between items-center">
                <span className="font-serif text-xl 3xl:text-5xl text-gray-500">Amount Paid</span>
                <span className="font-serif text-3xl 3xl:text-8xl text-[#6f2434] font-bold">${data?.amount}.00</span>
              </div>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="bg-rose-50 p-8 3xl:p-20 rounded-[2rem] 3xl:rounded-[4rem] flex flex-col justify-between border border-rose-100">
            <div>
              <h3 className="font-serif text-2xl 3xl:text-6xl text-[#6f2434] mb-6 italic">The Next Step</h3>
              <p className="text-gray-600 text-base 3xl:text-4xl leading-relaxed mb-10">
                Our matchmakers have already started prioritizing your profile. Add more photos to your gallery to increase your discoverability by 300%.
              </p>
            </div>
            <div className="flex flex-col gap-4 3xl:gap-8">
              <button onClick={() => navigate('/matches')} className="bg-[#6f2434] text-white py-5 3xl:py-10 rounded-full font-bold text-lg 3xl:text-5xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
                Start Searching <span className="material-symbols-outlined 3xl:text-5xl">arrow_forward</span>
              </button>
              <button onClick={() => navigate('/profile')} className="bg-white text-[#6f2434] border-2 border-[#6f2434] py-5 3xl:py-10 rounded-full font-bold text-lg 3xl:text-5xl hover:bg-rose-50 transition-all">
                View My Profile
              </button>
            </div>
          </div>
        </div>

        {/* RECEIPT LINK */}
        <div className="flex flex-col items-center gap-6 3xl:gap-12">
          <button 
  onClick={handleDownloadReceipt}
  className="text-[#6f2434] font-bold 3xl:text-4xl flex items-center gap-3 hover:underline active:scale-95 transition-transform"
>
  <span className="material-symbols-outlined 3xl:text-5xl">download</span>
  Download Receipt (PDF)
</button>
           <div className="flex items-center gap-4 text-gray-400">
             <span className="material-symbols-outlined text-sm 3xl:text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
             <span className="text-[10px] 3xl:text-2xl uppercase tracking-[0.2em] font-bold">Secure 256-bit Encrypted Transaction</span>
           </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Rows
const Row = ({ label, value, mono, bold }: any) => (
  <div className="flex justify-between items-center text-sm md:text-base 3xl:text-4xl">
    <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px] 3xl:text-2xl">{label}</span>
    <span className={`${mono ? 'font-mono text-xs 3xl:text-3xl' : ''} ${bold ? 'font-bold text-rose-600' : 'text-gray-800 font-semibold'}`}>{value}</span>
  </div>
);

export default PaymentSuccess;