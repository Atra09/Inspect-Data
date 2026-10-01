import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange = () => {},
  placeholder = 'Cari...',
  onClear = null,
  className = '',
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative flex items-center w-full min-w-[200px] ${className}`}>
      <Search
        size={18}
        className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors peer-focus:text-[#0284C7]"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors outline-none cursor-pointer"
          title="Hapus pencarian"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
