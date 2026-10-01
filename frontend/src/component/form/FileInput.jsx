import React from 'react';

const FileInput = ({ onChange, className = '', ...props }) => {
  return (
    <input
      type="file"
      onChange={onChange}
      {...props}
      className={`block w-full text-xs sm:text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:sm:text-sm file:font-bold file:bg-sky-50 file:text-[#0284C7] hover:file:bg-sky-100 cursor-pointer transition-colors ${className}`}
    />
  );
};

export default FileInput;
