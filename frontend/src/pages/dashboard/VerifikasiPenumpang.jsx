import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserCheck, CheckCircle2, Clock } from 'lucide-react';
import ResultCard from '../../component/inspeksi/ResultCard';
import Flash from '../../component/notif/flash';

export default function VerifikasiPenumpang() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [manifest, setManifest] = useState(null);
  const [penumpang, setPenumpang] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resM, resP] = await Promise.all([
        fetch(`/api/manifest/${id}`, { headers }),
        fetch(`/api/penumpang/manifest/${id}`, { headers }),
      ]);

      if (resM.ok) {
        const m = await resM.json();
        setManifest(m.data || m.datas || m);
      }
      if (resP.ok) {
        const p = await resP.json();
        const list = p.datas || p.data || [];
        setPenumpang(list);
        const pendingIdx = list.findIndex((item) => item.status_verifikasi === 'pending');
        if (pendingIdx !== -1) setIdx(pendingIdx);
      }
    } catch {
      setToast({ message: 'Gagal memuat data penumpang', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (formData) => {
    const cur = penumpang[idx];
    if (!cur?.id_penumpang) return;
    setSaving(true);
    try {
      const payload = {
        nik: formData.nik,
        nama_penumpang: formData.nama,
        tempat_lahir: formData.tempatLahir,
        tanggal_lahir: formData.tanggalLahir,
        jenis_kelamin: formData.jenisKelamin,
        alamat: formData.alamat,
        kategori_penumpang: formData.kategoriPenumpang || 'Dewasa',
        status_verifikasi: 'selesai',
      };

      const res = await fetch(`/api/penumpang/${cur.id_penumpang}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToast({ message: `Penumpang "${formData.nama}" berhasil disetujui!`, type: 'success' });
        setPenumpang((prev) => prev.map((item, i) => (i === idx ? { ...item, ...payload, status_verifikasi: 'selesai' } : item)));
        if (idx < penumpang.length - 1) setTimeout(() => setIdx((i) => i + 1), 500);
      } else {
        setToast({ message: 'Gagal menyetujui penumpang', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan sistem', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const currentP = penumpang[idx];
  const photoUrl = currentP?.foto_ktp ? (currentP.foto_ktp.startsWith('/') ? currentP.foto_ktp : `/${currentP.foto_ktp}`) : '';
  const pendingCount = penumpang.filter((p) => p.status_verifikasi === 'pending').length;
  const selesaiCount = penumpang.filter((p) => p.status_verifikasi === 'selesai').length;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-xs font-bold">Memuat data...</div>;
  }

  return (
    <div className="space-y-5 font-sans">
      <Flash toast={toast} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate('/manifest')} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-1 cursor-pointer">
            <ArrowLeft size={15} /> Kembali ke Manifest
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck size={22} className="text-[#0284C7]" /> Verifikasi Penumpang
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kapal: <strong className="text-slate-800 uppercase">{manifest?.nama_kapal || manifest?.kapal?.nama_kapal || '-'}</strong>
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold">Total: {penumpang.length}</span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200 flex items-center gap-1">
            <Clock size={12} className="animate-pulse" /> Pending: {pendingCount}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={12} /> Selesai: {selesaiCount}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {penumpang.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Belum ada data penumpang pada manifest ini.
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Passenger Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {penumpang.map((p, i) => (
              <button
                key={p.id_penumpang || i}
                onClick={() => setIdx(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                  idx === i
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : p.status_verifikasi === 'selesai'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                #{i + 1} {p.nama_penumpang || 'Penumpang'}
              </button>
            ))}
          </div>

          {/* ResultCard Component */}
          {currentP && (
            <ResultCard
              key={currentP.id_penumpang || idx}
              data={currentP}
              previewImage={photoUrl}
              selectedKapal={manifest?.kapal}
              onSave={handleApprove}
              onRescan={loadData}
              isSaving={saving}
              currentIndex={idx}
              totalCount={penumpang.length}
              onPrev={() => setIdx((i) => Math.max(0, i - 1))}
              onNext={() => setIdx((i) => Math.min(penumpang.length - 1, i + 1))}
              saveButtonText="Verifikasi?"
            />
          )}
        </div>
      )}
    </div>
  );
}
