import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ type = 'text', className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={`h-10 sm:h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2 text-xs sm:text-sm shadow-xs transition-all focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 disabled:bg-slate-50 disabled:text-slate-400 ${isPassword ? 'pr-10' : ''} ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer outline-none p-0.5"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
