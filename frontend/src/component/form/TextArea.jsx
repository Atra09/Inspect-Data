import React from 'react';

const TextArea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-xs transition-all focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
  />
);

export default TextArea;
