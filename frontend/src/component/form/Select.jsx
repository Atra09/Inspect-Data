import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';

const Select = ({ options = [], value, onChange, name, id, required, placeholder = "Cari..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const menuRef = useRef(null);
  const ulRef = useRef(null);
  const searchInputRef = useRef(null);

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [direction, setDirection] = useState('down');

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const selectedLabel = selectedOption?.label || (options[0]?.value === '' ? options[0]?.label : 'Pilih Opsi');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateMenuPosition = useCallback(() => {
    if (!selectRef.current) {
      setIsOpen(false);
      return;
    }
    const rect = selectRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = Math.min(250, options.length * 40);

    if (spaceBelow < menuHeight && rect.top > menuHeight) {
      setDirection('up');
    } else {
      setDirection('down');
    }

    setMenuPosition({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  }, [options.length]);

  const toggleDropdown = () => {
    if (!isOpen) {
      updateMenuPosition();
      setSearchTerm('');
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current && !selectRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    let scrollableParent = selectRef.current?.parentElement;
    let found = false;
    while (scrollableParent && !found) {
      if (scrollableParent.tagName === 'BODY') break;
      const style = window.getComputedStyle(scrollableParent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        found = true;
        break;
      }
      scrollableParent = scrollableParent.parentElement;
    }

    window.addEventListener('scroll', updateMenuPosition, true);
    window.addEventListener('resize', updateMenuPosition);

    if (found && scrollableParent) {
      scrollableParent.addEventListener('scroll', updateMenuPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
      if (found && scrollableParent) {
        scrollableParent.removeEventListener('scroll', updateMenuPosition);
      }
    };
  }, [isOpen, updateMenuPosition]);

  const DropdownMenu = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: direction === 'down' ? `${menuPosition.bottom + 4}px` : 'auto',
        bottom: direction === 'up' ? `${window.innerHeight - menuPosition.top + 4}px` : 'auto',
        left: `${menuPosition.left}px`,
        width: `${menuPosition.width}px`,
        zIndex: 99999,
      }}
      className="bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150"
    >
      <div className="p-2 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center gap-1.5">
        <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          className="w-full px-2 py-1 text-xs sm:text-sm text-slate-700 focus:outline-none"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <ul ref={ulRef} className="py-1 max-h-60 overflow-y-auto">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            (!option.disabled || (index === 0 && !searchTerm)) && (
              <li
                key={option.value}
                className={`px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] cursor-pointer transition-colors ${
                  String(option.value) === String(value) ? 'bg-sky-50 font-bold text-[#0284C7]' : ''
                }`}
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {option.label}
              </li>
            )
          ))
        ) : (
          <li className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 text-center">
            Data tidak ditemukan
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="relative w-full" ref={selectRef}>
      <select
        name={name}
        id={id}
        value={value}
        required={required}
        onChange={onChange}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%',
          height: '100%', opacity: 0, pointerEvents: 'none', zIndex: -1
        }}
        tabIndex={-1}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={`w-full h-10 sm:h-11 px-3.5 sm:px-4 text-left bg-white border rounded-xl shadow-xs focus:outline-none flex items-center justify-between transition-all ${
          isOpen ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20' : 'border-slate-300'
        }`}
        onClick={toggleDropdown}
      >
        <span className="truncate block mr-2 text-xs sm:text-sm text-slate-700 font-medium">
          {selectedLabel}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
      </button>

      {isOpen && ReactDOM.createPortal(DropdownMenu, document.body)}
    </div>
  );
};

export default Select;
