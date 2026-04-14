import React, { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string; // For additional wrapper styles
  contentClassName?: string; // For additional inner container styles
  title?: ReactNode;
  subtitle?: ReactNode;
  headerAction?: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '', 
  contentClassName = '',
  title,
  subtitle,
  headerAction,
}) => {
  return (
    <div className={`min-h-screen bg-rose-50/30 p-6 md:p-12 3xl:p-24 ${className}`}>
      <div className={`max-w-7xl 3xl:max-w-[2400px] mx-auto ${contentClassName}`}>
        
        {/* Optional built-in Title Section */}
        {(title || subtitle || headerAction) && (
          <div className="mb-12 3xl:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {title && <h1 className="text-3xl md:text-5xl 3xl:text-8xl font-bold text-gray-800 tracking-tight">{title}</h1>}
              {subtitle && <p className="text-gray-500 text-lg 3xl:text-4xl mt-2">{subtitle}</p>}
            </div>
            {headerAction && (
              <div className="flex gap-4">
                {headerAction}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};
