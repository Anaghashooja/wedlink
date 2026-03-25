import { Link } from "react-router-dom";

export const Hero = () => {
  const token = localStorage.getItem('token');
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-rose-50 via-white to-rose-100 px-4 py-12 xs:py-16 md:py-24 xl:py-40 3xl:py-60 font-poppins">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-screen-xl 2xl:max-w-screen-2xl 3xl:max-w-screen-3xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">
        
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6 xs:space-y-8">
          <div className="inline-block px-4 py-1.5 bg-rose-100 border border-rose-200 rounded-full text-rose-600 text-sm 3xl:text-2xl font-bold tracking-wide uppercase">
            💖 India's Most Trusted Matchmaking
          </div>
          
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-7xl xl:text-8xl 3xl:text-9xl font-extrabold text-gray-900 leading-[1.1]">
            Find your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-pink-500 font-k2d">
              Perfect Soulmate
            </span>
          </h1>

          <p className="text-base xs:text-lg md:text-xl xl:text-2xl 3xl:text-4xl text-gray-600 font-inter max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Where tradition meets technology. Join millions of verified profiles and start your journey toward a beautiful forever.
          </p>

          <div className="flex flex-col xs:flex-row gap-4 justify-center md:justify-start pt-4">
            {/* CHANGED THIS: Link now points to /matches */}
            <Link 
              to={token ? "/matches" : "/auth"} 
              className="group relative inline-flex items-center justify-center bg-rose-500 text-white px-10 py-4 3xl:px-16 3xl:py-8 3xl:text-3xl rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm 3xl:text-2xl">
              <span className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img key={i} className="w-8 h-8 3xl:w-12 3xl:h-12 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" />
                ))}
              </span>
              <span className="font-medium">5M+ Verified Users</span>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 relative group">
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" 
              alt="Happy Couple" 
              className="w-full object-cover h-[350px] xs:h-[450px] md:h-[550px] xl:h-[700px] 3xl:h-[1000px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};