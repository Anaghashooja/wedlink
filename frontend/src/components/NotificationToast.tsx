import React, { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  title: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

const NotificationToast: React.FC<ToastProps> = ({ show, message, title, type, onClose }) => {
  
  // Auto-hide after 5 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  // Type-based colors and icons
  const config = {
    success: { icon: 'favorite', color: 'text-green-500', bg: 'border-green-100' },
    info: { icon: 'notifications_active', color: 'text-rose-500', bg: 'border-rose-100' },
    error: { icon: 'warning', color: 'text-red-500', bg: 'border-red-100' },
  };

  return (
    /* Positioning: Top-right, high Z-index */
    <div className="fixed top-24 right-6 md:right-12 z-[9999] animate-slide-in">
      <div className={`
        bg-white/90 backdrop-blur-xl border-2 ${config[type].bg}
        w-[320px] md:w-[400px] 2xl:w-[500px] 3xl:w-[700px] 
        p-4 md:p-6 3xl:p-12 
        rounded-[1.5rem] md:rounded-[2.5rem] 3xl:rounded-[4rem] 
        shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
        flex items-center gap-4 md:gap-6 3xl:gap-10
      `}>
        
        {/* Animated Icon Circle */}
        <div className={`
          flex-shrink-0 w-12 h-12 md:w-16 md:h-16 3xl:w-32 3xl:h-32 
          rounded-full bg-white shadow-inner flex items-center justify-center 
          ${config[type].color}
        `}>
          <span className="material-symbols-outlined text-2xl md:text-3xl 3xl:text-7xl" style={{fontVariationSettings: "'FILL' 1"}}>
            {config[type].icon}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-grow">
          <h4 className="text-gray-900 font-bold text-sm md:text-lg 3xl:text-4xl">
            {title}
          </h4>
          <p className="text-gray-500 text-xs md:text-base 3xl:text-3xl leading-relaxed mt-1">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">
          <span className="material-symbols-outlined text-lg md:text-2xl 3xl:text-5xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;