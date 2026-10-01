import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, PlusCircle, FileCheck, Printer } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Inspeksi Mobile',
      desc: 'Scan & audit fisik lapangan',
      icon: QrCode,
      color: 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]',
      shadow: 'shadow-[#0284C7]/20',
      action: () => navigate('/inspeksi'),
    },
    {
      title: 'Buat Clearance Baru',
      desc: 'Pengajuan izin berlayar',
      icon: PlusCircle,
      color: 'bg-gradient-to-r from-sky-500 to-blue-600',
      shadow: 'shadow-sky-500/20',
      action: () => navigate('/clearance/add'),
    },
    {
      title: 'Verifikasi Manifest',
      desc: 'Audit muatan & Nahkoda',
      icon: FileCheck,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      action: () => navigate('/manifest'),
    },
    {
      title: 'Cetak Laporan SPB',
      desc: 'Rekap surat persetujuan',
      icon: Printer,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      action: () => navigate('/log-aktivitas'),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
      <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
        Pintasan Aksi Cepat
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all text-left group outline-none cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shrink-0 shadow-md ${item.shadow} group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-[#0284C7] transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
