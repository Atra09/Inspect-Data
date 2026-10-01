import React from 'react';

const Label = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`mb-1.5 block text-xs sm:text-sm font-bold text-slate-700 ${className}`}>
    {children}
  </label>
);

export default Label;
