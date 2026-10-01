import React from 'react';

export default function RowsPerPageSelect({
  value = 10,
  onChange = () => {},
  options = [5, 10, 25, 50, 100],
  label = 'Tampilkan',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2 text-xs text-slate-600 font-medium ${className}`}>
      {label && <span>{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-800 outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span>baris</span>
    </div>
  );
}
