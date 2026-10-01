import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

export default function DateRange({
  startDate = '',
  endDate = '',
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  onReset = null,
  className = '',
}) {
  const hasFilter = Boolean(startDate || endDate);

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${className}`}>
      {/* Start Date Input */}
      <div className="relative flex items-center flex-1 min-w-[140px]">
        <Calendar size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 outline-none transition-all text-slate-800 font-semibold cursor-pointer"
          title="Tanggal Mulai"
        />
      </div>

      <span className="hidden sm:inline text-xs font-bold text-slate-400 px-1">s/d</span>

      {/* End Date Input */}
      <div className="relative flex items-center flex-1 min-w-[140px]">
        <Calendar size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 outline-none transition-all text-slate-800 font-semibold cursor-pointer"
          title="Tanggal Selesai"
        />
      </div>

      {/* Reset Button */}
      {hasFilter && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200/80 hover:border-rose-400 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-1 text-xs font-bold outline-none cursor-pointer shrink-0"
          title="Reset Tanggal"
        >
          <RotateCcw size={14} />
          <span className="hidden md:inline">Reset</span>
        </button>
      )}
    </div>
  );
}
