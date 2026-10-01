import React, { useState, useEffect } from 'react';
import { UserCheck, RefreshCw, CheckCircle2, Copy, Image as ImageIcon, ShieldCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { decodeNIK } from '../../utils/nikDecoder';

// Helper: Calculate age category ('Anak' vs 'Dewasa')
function getKategoriUsia(str) {
  if (!str) return '';
  const s = String(str).trim();
  let day, month, year;
  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(s)) {
    const p = s.split(/[-/]/);
    day = +p[0]; month = +p[1] - 1; year = +p[2];
  } else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(s)) {
    const p = s.split(/[-/]/);
    year = +p[0]; month = +p[1] - 1; day = +p[2];
  } else return '';
  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return '';
  const age = new Date().getFullYear() - d.getFullYear();
  return age < 12 ? 'Anak' : 'Dewasa';
}

// Helper: Normalize gender to dropdown options ('LAKI-LAKI' / 'PEREMPUAN')
function normalizeGender(val) {
  if (!val) return 'LAKI-LAKI';
  const s = String(val).trim().toUpperCase();
  if (s === 'L' || s.includes('LAK') || s === 'MALE') return 'LAKI-LAKI';
  if (s === 'P' || s.includes('PEREM') || s === 'FEMALE') return 'PEREMPUAN';
  return s;
}

// Helper: Map data prop into clean initial form state (supports both camelCase and raw DB snake_case)
const mapInitialData = (data = {}, selectedKapal = null) => ({
  nik: data.nik || '',
  nama: data.nama || data.nama_penumpang || '',
  tempatLahir: data.tempatLahir || data.tempat_lahir || '',
  tanggalLahir: data.tanggalLahir || data.tanggal_lahir || '',
  jenisKelamin: normalizeGender(data.jenisKelamin || data.jenis_kelamin),
  alamat: data.alamat || '',
  namaKapal: data.namaKapal || selectedKapal?.nama || selectedKapal?.nama_kapal || 'KM SYAHBANDAR KSOP',
});

export default function ResultCard({
  data = {},
  previewImage = '',
  selectedKapal = null,
  onSave = () => {},
  onRescan = () => {},
  isSaving = false,
  currentIndex = 0,
  totalCount = 0,
  onPrev = null,
  onNext = null,
  saveButtonText = 'Setujui (Status Selesai)',
}) {
  const [formData, setFormData] = useState(() => mapInitialData(data, selectedKapal));
  const [copiedField, setCopiedField] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(mapInitialData(data, selectedKapal));
    }
  }, [data, selectedKapal]);

  const handleNIKChange = (val) => {
    const cleanVal = val.replace(/\D/g, '').slice(0, 16);
    setFormData((prev) => {
      const updated = { ...prev, nik: cleanVal };
      if (cleanVal.length === 16) {
        const decoded = decodeNIK(cleanVal);
        if (decoded?.isValid) {
          if (!updated.tanggalLahir) updated.tanggalLahir = decoded.tanggalLahir;
          if (!updated.jenisKelamin) updated.jenisKelamin = normalizeGender(decoded.jenisKelamin);
          if (!updated.tempatLahir) updated.tempatLahir = decoded.tempatLahir;
        }
      }
      return updated;
    });
  };

  const handleChange = (field, val) => setFormData((prev) => ({ ...prev, [field]: val }));

  const handleCopy = (field, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const kategoriUsia = getKategoriUsia(formData.tanggalLahir);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, kategoriPenumpang: kategoriUsia || 'Dewasa' });
  };

  const isFirst = currentIndex === 0 || !onPrev;
  const isLast = currentIndex >= totalCount - 1 || !onNext;

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden font-sans animate-in fade-in duration-200 relative">
      {/* Mobile Fixed Floating Navigation Side Arrows (Fixed in Screen Center) */}
      {totalCount > 1 && (
        <>
          <button
            type="button"
            disabled={isFirst}
            onClick={onPrev}
            className="sm:hidden fixed left-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-sky-200/80 text-[#0284C7] flex items-center justify-center active:scale-95 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer outline-none"
            title="Penumpang Sebelumnya"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onNext}
            className="sm:hidden fixed right-2 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-sky-200/80 text-[#0284C7] flex items-center justify-center active:scale-95 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer outline-none"
            title="Penumpang Selanjutnya"
          >
            <ChevronRight size={24} className="stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            <UserCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide uppercase">Hasil Inspeksi e-KTP</h2>
            <span className="text-[11px] text-sky-100 font-medium">Data Esensial Verifikasi Penumpang KSOP</span>
          </div>
        </div>

        {/* Counter Badge & Desktop Header Prev/Next */}
        {totalCount > 0 && (
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
            <button
              type="button"
              disabled={isFirst}
              onClick={onPrev}
              className="hidden sm:inline-flex p-1 rounded-lg hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer outline-none"
              title="Penumpang Sebelumnya"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <span className="text-xs font-extrabold tracking-wider text-white px-1">
              {currentIndex + 1} / {totalCount}
            </span>
            <button
              type="button"
              disabled={isLast}
              onClick={onNext}
              className="hidden sm:inline-flex p-1 rounded-lg hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer outline-none"
              title="Penumpang Selanjutnya"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onRescan}
          className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 outline-none cursor-pointer ml-auto sm:ml-0"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Scan Ulang</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5">
        {/* Photo Preview & NIK Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
          {previewImage && (
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 max-h-36 bg-slate-900 flex items-center justify-center"
              onClick={() => setShowImagePreview(true)}
            >
              <img src={previewImage} alt="KTP Watermarked Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                <ImageIcon size={16} />
                <span>Lihat Foto Watermark</span>
              </div>
            </div>
          )}

          <div className={`flex flex-col justify-center ${previewImage ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                NIK (16 Digit)
                {formData.nik.length === 16 && <CheckCircle2 size={15} className="text-emerald-500" />}
              </label>
              <button
                type="button"
                onClick={() => handleCopy('nik', formData.nik)}
                className="text-[11px] text-[#0284C7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy size={12} />
                {copiedField === 'nik' ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
            <input
              type="text"
              maxLength={16}
              value={formData.nik}
              onChange={(e) => handleNIKChange(e.target.value)}
              className="w-full px-4 py-3 text-base font-extrabold tracking-widest text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none transition-all shadow-inner"
              placeholder="3578xxxxxxxxxxxx"
              required
            />
          </div>
        </div>

        {/* Identity Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormGroup label="Kapal / Armada Inspeksi" className="sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              value={formData.namaKapal}
              onChange={(e) => handleChange('namaKapal', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-extrabold text-[#0284C7] bg-sky-50/90 border border-sky-200/90 rounded-xl focus:border-[#0284C7] outline-none"
              placeholder="NAMA KAPAL INSPEKSI"
              required
            />
          </FormGroup>

          <FormGroup label="Nama Lengkap" className="sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200/90 rounded-xl focus:border-[#0284C7] outline-none"
              placeholder="NAMA SESUAI KTP"
              required
            />
          </FormGroup>

          <FormGroup label="Tempat Lahir">
            <input
              type="text"
              value={formData.tempatLahir}
              onChange={(e) => handleChange('tempatLahir', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl focus:border-[#0284C7] outline-none"
              placeholder="KOTA LAHIR"
            />
          </FormGroup>

          <FormGroup
            label={
              <span>
                Tanggal Lahir
                {kategoriUsia && (
                  <span className={`ml-1.5 font-extrabold ${kategoriUsia === 'Anak' ? 'text-amber-600' : 'text-[#0284C7]'}`}>
                    ({kategoriUsia})
                  </span>
                )}
              </span>
            }
          >
            <input
              type="text"
              value={formData.tanggalLahir}
              onChange={(e) => handleChange('tanggalLahir', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl focus:border-[#0284C7] outline-none"
              placeholder="DD-MM-YYYY"
            />
          </FormGroup>

          <FormGroup label="Jenis Kelamin">
            <select
              value={formData.jenisKelamin}
              onChange={(e) => handleChange('jenisKelamin', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200/90 rounded-xl focus:border-[#0284C7] outline-none cursor-pointer"
            >
              <option value="">-- PILIH JENIS KELAMIN --</option>
              <option value="LAKI-LAKI">LAKI-LAKI</option>
              <option value="PEREMPUAN">PEREMPUAN</option>
            </select>
          </FormGroup>

          <FormGroup label="Alamat Lengkap" className="sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl focus:border-[#0284C7] outline-none"
              placeholder="ALAMAT LENGKAP KOTA/KABUPATEN"
            />
          </FormGroup>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200/70 text-sky-800 text-xs font-medium">
          <ShieldCheck size={18} className="text-[#0284C7] shrink-0" />
          <span>Data KTP dilindungi sesuai UU PDP No. 27/2022. Foto arsip otomatis diberi watermark instansi KSOP & Armada Kapal.</span>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {totalCount > 1 && (
              <>
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={onPrev}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer outline-none disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  onClick={onNext}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer outline-none disabled:opacity-30 flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRescan}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer outline-none"
            >
              Batal / Scan Ulang
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer outline-none disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                'Memproses...'
              ) : (
                <>
                  <Check size={16} />
                  <span>{saveButtonText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Image Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowImagePreview(false)}>
          <div className="relative max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Full Watermarked KTP" className="w-full h-auto rounded-xl" />
            <button type="button" onClick={() => setShowImagePreview(false)} className="mt-3 w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer">
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormGroup({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
