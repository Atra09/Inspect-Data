import React from 'react';
import { Camera, Upload, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * ScanCard Component
 * Komponen kartu aksi pindaian e-KTP (Kamera & Unggah Foto)
 * @param {Object} props
 * @param {Function} props.onOpenCamera - Handler to trigger opening camera viewfinder
 * @param {Function} props.onFileUpload - Handler to handle image file upload
 */
export default function ScanCard({ onOpenCamera, onFileUpload }) {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-[#E0F2FE] border-4 border-white shadow-md shadow-[#0284C7]/20 flex items-center justify-center text-[#0284C7] animate-pulse">
        <Camera size={36} />
      </div>

      <div className="max-w-md flex flex-col gap-1.5">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center justify-center gap-2">
          Pindai e-KTP Penumpang
          <Sparkles size={16} className="text-amber-500" />
        </h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Buka kamera untuk mengambil foto KTP. Sistem akan membaca NIK & Identitas secara otomatis dengan presisi tinggi.
        </p>
      </div>

      {/* Camera Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mt-2">
        <button
          type="button"
          onClick={onOpenCamera}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-xs font-bold shadow-lg shadow-[#0284C7]/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer"
        >
          <Camera size={18} />
          <span>Buka Kamera Scanner</span>
        </button>

        <label className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 outline-none cursor-pointer shrink-0">
          <Upload size={16} />
          <span>Unggah Foto</span>
          <input type="file" accept="image/*" className="hidden" onChange={onFileUpload} />
        </label>
      </div>

      {/* Security Notice */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-[11px]">
        <ShieldCheck size={16} className="text-[#0284C7] shrink-0" />
        <span>Memenuhi Aturan UU PDP No. 27/2022. Watermark instansi otomatis ditambahkan.</span>
      </div>
    </div>
  );
}
