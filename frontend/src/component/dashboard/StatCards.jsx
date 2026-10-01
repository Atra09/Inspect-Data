import React from 'react';
import { Ship, CheckCircle2, AlertTriangle, Anchor, ArrowUpRight } from 'lucide-react';

export default function StatCards() {
  const stats = [
    {
      title: 'Total Clearance Kapal',
      value: '142',
      unit: 'Kapal minggu ini',
      change: '+12.5%',
      isPositive: true,
      icon: Ship,
      iconBg: 'bg-[#0284C7]/10 text-[#0284C7]',
      borderColor: 'border-[#0284C7]/20',
    },
    {
      title: 'Kapal Berlabuh di Dermaga',
      value: '38',
      unit: 'Status Tambat',
      change: '+4 Kapal hari ini',
      isPositive: true,
      icon: Anchor,
      iconBg: 'bg-sky-500/10 text-sky-600',
      borderColor: 'border-sky-200',
    },
    {
      title: 'Inspeksi Lapangan Lolos',
      value: '98.4%',
      unit: 'Verifikasi Fisik & Dokumen',
      change: '104 Lolos',
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Flag Peringatan Manifest',
      value: '3',
      unit: 'Membutuhkan Audit',
      change: 'Perlu Verifikasi',
      isPositive: false,
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 text-amber-600',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 border ${stat.borderColor} shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                <Icon size={20} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{stat.unit}</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                    stat.isPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {stat.change}
                  {stat.isPositive && <ArrowUpRight size={12} />}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
