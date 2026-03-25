 
  import { Hero } from "../components/Hero";
const Home = () => {

  return (
    <main>
      <Hero />
      {/* You can add more components like Features or Testimonials here later */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose Wedlink?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-rose-500 text-4xl mb-4">🛡️</div>
            <h3 className="font-bold text-xl mb-2">Verified Profiles</h3>
            <p className="text-gray-600">Manual screening processes to ensure authentic members.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-rose-500 text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-xl mb-2">Privacy Control</h3>
            <p className="text-gray-600">You decide who sees your photos and contact details.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-rose-500 text-4xl mb-4">🤝</div>
            <h3 className="font-bold text-xl mb-2">Matchmaking</h3>
            <p className="text-gray-600">Our algorithm finds people based on your lifestyle & values.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;