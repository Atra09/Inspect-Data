import React, { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronDown, Check, Trash2 } from 'lucide-react';

const CustomCombobox = ({ items = [], selected, setSelected, onAddItem, onDeleteItem, placeholder, className = '' }) => {
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );

  const showAddItemButton = query.length > 0 && !items.some((item) => item.toLowerCase() === query.toLowerCase());

  const handleDelete = (e, item) => {
    e.stopPropagation();
    if (window.confirm(`Anda yakin ingin menghapus "${item}"?`)) {
      if (onDeleteItem) onDeleteItem(item);
    }
  };

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className={`relative ${className}`}>
        <div className="relative w-full cursor-default overflow-hidden rounded-xl border border-slate-300 bg-white text-left shadow-xs focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-[#0284C7]/20">
          <Combobox.Input
            className="h-10 sm:h-11 w-full border-none py-2.5 pl-3.5 sm:pl-4 pr-10 text-xs sm:text-sm leading-5 text-slate-700 focus:ring-0 focus:outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
            <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 text-xs sm:text-sm shadow-xl ring-1 ring-black/5 focus:outline-none">
            {filteredItems.length === 0 && !showAddItemButton && (
              <div className="relative cursor-default select-none py-2.5 px-4 text-slate-500">
                Tidak ditemukan.
              </div>
            )}
            {filteredItems.map((item) => (
              <Combobox.Option
                key={item}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2.5 pl-9 pr-4 ${
                    active ? 'bg-sky-50 text-[#0284C7]' : 'text-slate-700'
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className={`block truncate ${selected ? 'font-bold text-[#0284C7]' : 'font-normal'}`}>
                      {item}
                    </span>
                    {onDeleteItem && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item)}
                        className="ml-4 rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-[#0284C7]">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Combobox.Option>
            ))}
            {showAddItemButton && onAddItem && (
              <div className="py-2.5 px-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Item tidak ditemukan.</p>
                <button
                  type="button"
                  onClick={() => onAddItem(query)}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                >
                  Tambah "{query}"
                </button>
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default CustomCombobox;
