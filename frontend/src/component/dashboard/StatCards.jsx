import React, { useState, useEffect } from 'react';
import { Ship, CheckCircle2, AlertTriangle, Anchor } from 'lucide-react';

export default function StatCards() {
  const [statsData, setStatsData] = useState({
    totalClearance: 0,
    kapalTambat: 0,
    inspeksiLolos: 0,
    pendingAudit: 0,
    totalPenumpang: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resManifest, resKapal] = await Promise.allSettled([
          fetch('/api/manifest', { headers }),
          fetch('/api/kapal/all', { headers }),
        ]);

        let manifestList = [];
        let kapalCount = 0;

        if (resManifest.status === 'fulfilled' && resManifest.value.ok) {
          const resJson = await resManifest.value.json();
          manifestList = resJson.datas || resJson.data || [];
        }

        if (resKapal.status === 'fulfilled' && resKapal.value.ok) {
          const kapalJson = await resKapal.value.json();
          const listKapal = kapalJson.datas || kapalJson.data || [];
          kapalCount = listKapal.length;
        }

        const totalClearance = manifestList.length;
        const pendingAudit = manifestList.filter(
          (m) => m.status_inspeksi === 'pending' || m.count_pending > 0
        ).length;
        const inspeksiLolos = manifestList.filter(
          (m) => m.status_inspeksi === 'selesai'
        ).length;
        const totalPenumpang = manifestList.reduce(
          (acc, m) => acc + (m.total_penumpang || 0),
          0
        );

        setStatsData({
          totalClearance,
          kapalTambat: kapalCount,
          inspeksiLolos,
          pendingAudit,
          totalPenumpang,
        });
      } catch (err) {
        console.error('Fetch Stats Error:', err);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Sesi Manifest',
      value: String(statsData.totalClearance),
      unit: 'Data Terdaftar',
      change: `${statsData.totalClearance} Clearance`,
      isPositive: true,
      icon: Ship,
      iconBg: 'bg-[#0284C7]/10 text-[#0284C7]',
      borderColor: 'border-[#0284C7]/20',
    },
    {
      title: 'Total Kapal Terdaftar',
      value: String(statsData.kapalTambat),
      unit: 'Master Kapal',
      change: `${statsData.kapalTambat} Kapal`,
      isPositive: true,
      icon: Anchor,
      iconBg: 'bg-sky-500/10 text-sky-600',
      borderColor: 'border-sky-200',
    },
    {
      title: 'Inspeksi Manifest Selesai',
      value: String(statsData.inspeksiLolos),
      unit: 'Verifikasi Penumpang',
      change: `${statsData.inspeksiLolos} Terverifikasi`,
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Pending Verifikasi',
      value: String(statsData.pendingAudit),
      unit: 'Butuh Audit',
      change: statsData.pendingAudit > 0 ? 'Perlu Verifikasi' : 'Semua Selesai',
      isPositive: statsData.pendingAudit === 0,
      icon: AlertTriangle,
      iconBg: statsData.pendingAudit > 0 ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 text-slate-500',
      borderColor: statsData.pendingAudit > 0 ? 'border-amber-200' : 'border-slate-200',
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
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
