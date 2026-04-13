import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SuccessStories: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ coupleNames: '', location: '', testimonial: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStories = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/stories');
      const data = await res.json();
      setStories(data);
    } catch (err) { console.error("Failed to load stories"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStories(); }, []);

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a photo");
    setIsSubmitting(true);

    const data = new FormData();
    data.append('coupleNames', formData.coupleNames);
    data.append('location', formData.location);
    data.append('testimonial', formData.testimonial);
    data.append('photos', file);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/stories/submit', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data
      });
      if (res.ok) {
        alert("Your story has been submitted for verification!");
        setShowForm(false);
        setFormData({ coupleNames: '', location: '', testimonial: '' });
      }
    } catch (err) { alert("Submission failed"); } 
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-rose-500 3xl:text-6xl">Loading...</div>;

  return (
    <div className="bg-[#fffcfb] min-h-screen font-inter pb-24">
      {/* HERO HEADER */}
      <section className="pt-20 pb-12 3xl:pt-40 3xl:pb-32 text-center px-6">
        <h1 className="text-4xl md:text-6xl 3xl:text-[10rem] font-serif italic text-rose-900">
          The Wedlink <span className="text-rose-500 not-italic font-sans font-bold uppercase tracking-widest">Union</span>
        </h1>
        <p className="mt-4 text-gray-500 text-lg 3xl:text-5xl max-w-2xl 3xl:max-w-6xl mx-auto">
          Real stories of love. Only verified success stories are displayed here.
        </p>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className="mt-10 bg-rose-500 text-white px-8 py-3 3xl:px-16 3xl:py-8 3xl:text-4xl rounded-full font-bold shadow-xl hover:bg-rose-600 transition-all active:scale-95"
        >
          {showForm ? "Close Form" : "Share Your Story"}
        </button>
      </section>

      {/* SUBMISSION FORM */}
      {showForm && (
        <section className="max-w-4xl 3xl:max-w-7xl mx-auto px-6 mb-20 animate-fade-in">
          <form onSubmit={handleStorySubmit} className="bg-white p-8 3xl:p-20 rounded-[2rem] 3xl:rounded-[4rem] shadow-2xl border border-rose-100 space-y-6 3xl:space-y-12">
            <h2 className="text-2xl 3xl:text-6xl font-bold text-gray-800 text-center mb-8">Your Journey Together</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 3xl:gap-12">
              <input 
                type="text" placeholder="Couple Names (e.g. Amal & Anagha)" 
                className="auth-input" required
                onChange={(e) => setFormData({...formData, coupleNames: e.target.value})}
              />
              <input 
                type="text" placeholder="Location" 
                className="auth-input" required
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
              <div className="md:col-span-2">
                <textarea 
                  placeholder="Tell us your story..." 
                  className="auth-input h-32 3xl:h-64 pt-4" required
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-2 3xl:text-3xl font-bold">Upload a Wedding Photo</label>
                <input type="file" className="auth-input p-2" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full bg-rose-900 text-white py-4 3xl:py-10 rounded-2xl 3xl:rounded-[3rem] font-bold 3xl:text-5xl"
            >
              {isSubmitting ? "Uploading..." : "Submit Story for Verification"}
            </button>
          </form>
        </section>
      )}

      {/* STORIES GRID */}
      <main className="max-w-7xl 3xl:max-w-[2400px] mx-auto px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 3xl:gap-16 space-y-8 3xl:space-y-16">
          {stories.map((story, i) => (
            <div key={i} className="break-inside-avoid group relative bg-white p-4 3xl:p-12 rounded-[2rem] 3xl:rounded-[4rem] shadow-sm border border-rose-50 hover:shadow-xl transition-all duration-500">
              <div className="overflow-hidden rounded-2xl 3xl:rounded-[3rem] mb-6">
                <img src={story.image} className="w-full grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
              </div>
              <div className="space-y-3 3xl:space-y-8">
                <h3 className="text-2xl 3xl:text-6xl font-serif italic text-gray-900">{story.coupleNames}</h3>
                <p className="text-xs 3xl:text-2xl font-bold uppercase tracking-widest text-rose-500">{story.location}</p>
                <p className="text-gray-600 text-sm 3xl:text-3xl leading-relaxed italic">"{story.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SuccessStories;