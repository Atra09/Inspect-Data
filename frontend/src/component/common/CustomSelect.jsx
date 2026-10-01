import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Pilih Opsi',
  label = '',
  icon: Icon = null,
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options array
  const formattedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: String(opt) }
  );

  // Selected option label
  const selectedOption = formattedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full flex flex-col gap-1 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-slate-700">{label}</label>
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs rounded-xl border transition-all text-left bg-white outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen
            ? 'border-[#0284C7] ring-2 ring-[#0284C7]/15 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
          <span className={`truncate font-semibold ${selectedOption ? 'text-slate-800' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0284C7]' : ''
          }`}
        />
      </button>

      {/* Select Options Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl py-1 z-50 max-h-56 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
          {formattedOptions.length === 0 ? (
            <div className="px-3.5 py-2 text-xs text-slate-400 font-medium text-center">
              Tidak ada pilihan
            </div>
          ) : (
            formattedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition-colors outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#E0F2FE] text-[#0284C7]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-[#0284C7] shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
