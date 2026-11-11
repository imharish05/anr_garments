import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items = [], wide = false }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200/80 py-3 px-4 sm:px-6 xl:px-8">
      <div className={`${wide ? 'w-full max-w-[1640px]' : 'max-w-7xl'} mx-auto flex items-center space-x-2 text-xs sm:text-[13px] text-slate-500 overflow-x-auto whitespace-nowrap`}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1A175A] font-medium transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || !item.to ? (
                <span className="font-bold text-[#1A175A] truncate max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-slate-600 hover:text-[#1A175A] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;