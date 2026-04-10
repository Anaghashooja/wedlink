import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-rose-50 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif italic text-2xl text-[#6f2434] mb-2 font-bold">Wedlink 
            <span className="text-rose-400 font-sans not-italic text-sm uppercase tracking-widest ml-2">Matrimony</span>
          </p>
          <p className="text-gray-400 text-xs uppercase tracking-widest">© {new Date().getFullYear()} Wedlink. All rights reserved.</p>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <Link to="/plans" className="hover:text-rose-600 transition-colors">Membership</Link>
          <Link to="/stories" className="hover:text-rose-600 transition-colors">Success Stories</Link>
          <Link to="/privacy" className="text-rose-600 hover:text-[#6f2434] font-bold transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
