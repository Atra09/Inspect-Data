import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import RowsPerPageSelect from './RowsPerPageSelect';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  totalEntries = 0,
  itemsPerPage = 5,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageSizeChange,
  className = '',
}) {
  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const btnStyle = "p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] disabled:opacity-40 disabled:hover:border-slate-200 transition-all outline-none bg-white cursor-pointer disabled:cursor-not-allowed";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium py-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium w-full sm:w-auto text-center sm:text-left">
        {onPageSizeChange && <RowsPerPageSelect value={itemsPerPage} onChange={onPageSizeChange} options={pageSizeOptions} />}
        {totalEntries > 0 ? (
          <span className="text-slate-500 font-medium text-xs ml-0.5">
            dari <strong className="text-slate-800 font-bold">{totalEntries}</strong> data
          </span>
        ) : (
          <span className="text-slate-500 font-medium text-xs ml-1">(Halaman {currentPage} dari {totalPages})</span>
        )}
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-1.5 overflow-x-auto w-full sm:w-auto self-center">
        <button type="button" onClick={() => onPageChange(1)} disabled={currentPage === 1} className={btnStyle} title="Halaman Pertama"><ChevronsLeft size={16} /></button>
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={btnStyle} title="Sebelumnya"><ChevronLeft size={16} /></button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold select-none text-xs">...</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg font-extrabold transition-all outline-none cursor-pointer flex items-center justify-center ${
                  currentPage === p ? 'bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/30' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7]'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={btnStyle} title="Berikutnya"><ChevronRight size={16} /></button>
        <button type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className={btnStyle} title="Halaman Terakhir"><ChevronsRight size={16} /></button>
      </div>
    </div>
  );
}
