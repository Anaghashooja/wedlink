import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SuccessStories: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/stories');
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-rose-500 3xl:text-6xl">Loading Happy Moments...</div>;

  return (
    <div className="bg-[#fffcfb] min-h-screen font-inter pb-24">
      
      {/* 1. HERO HEADER */}
      <section className="pt-20 pb-12 3xl:pt-40 3xl:pb-32 text-center px-6">
        <h1 className="text-4xl md:text-6xl 3xl:text-[10rem] font-serif italic text-rose-900 leading-tight">
          The Wedlink <span className="text-rose-500 not-italic font-sans font-bold uppercase tracking-widest">Union</span>
        </h1>
        <p className="mt-4 text-gray-500 text-lg 3xl:text-5xl max-w-2xl 3xl:max-w-6xl mx-auto">
          Real stories of love and lifelong commitment. Every great love story begins with a single intentional connection on Wedlink.
        </p>
      </section>

      {/* 2. MASONRY GRID */}
      <main className="max-w-7xl 3xl:max-w-[2400px] mx-auto px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 3xl:gap-16 space-y-8 3xl:space-y-16">
          {stories.map((story, i) => (
            <div key={i} className="break-inside-avoid group relative bg-white p-4 3xl:p-12 rounded-[2rem] 3xl:rounded-[4rem] shadow-sm border border-rose-50 hover:shadow-xl transition-all duration-500">
              
              {/* Couple Photo */}
              <div className="overflow-hidden rounded-2xl 3xl:rounded-[3rem] mb-6">
                <img 
                  src={story.image} 
                  alt={story.coupleNames} 
                  className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-3 3xl:space-y-8">
                <h3 className="text-2xl 3xl:text-6xl font-serif italic text-gray-900">{story.coupleNames}</h3>
                <p className="text-xs 3xl:text-2xl font-bold uppercase tracking-widest text-rose-500">
                  Joined forever in {story.location || 'India'}
                </p>
                <p className="text-gray-600 text-sm 3xl:text-3xl leading-relaxed italic">
                  "{story.testimonial}"
                </p>
                <div className="pt-4 border-t border-rose-50 flex justify-between items-center">
                  <span className="text-[10px] 3xl:text-2xl font-bold text-gray-400 uppercase tracking-tighter">Verified Success</span>
                  <span className="text-rose-200 group-hover:text-rose-500 transition-colors">❤</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. CTA FOOTER SECTION */}
      <section className="mt-24 3xl:mt-60 mx-6">
        <div className="max-w-5xl 3xl:max-w-[2000px] mx-auto bg-rose-900 rounded-[3rem] 3xl:rounded-[6rem] p-12 3xl:p-32 text-center text-white relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-800 rounded-full opacity-50"></div>
          
          <h2 className="text-3xl md:text-5xl 3xl:text-9xl font-serif italic mb-6">Start Your Own Story</h2>
          <p className="text-rose-100 text-lg 3xl:text-5xl mb-10 max-w-2xl 3xl:max-w-6xl mx-auto">
            Join the community where traditional values meet modern compatibility. Your perfect match is just one click away.
          </p>
          <Link to="/auth" className="inline-block bg-white text-rose-900 px-10 py-4 3xl:px-20 3xl:py-10 rounded-full font-bold text-xl 3xl:text-5xl hover:bg-rose-50 transition-all shadow-2xl active:scale-95">
             Register Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;