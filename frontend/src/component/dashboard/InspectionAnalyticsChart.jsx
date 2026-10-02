import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart3, TrendingUp, PieChart, ShieldCheck, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export default function InspectionAnalyticsChart() {
  const [manifestList, setManifestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterFrom, setFilterFrom] = useState(''); // 'YYYY-MM-DD'
  const [filterTo, setFilterTo] = useState(''); // 'YYYY-MM-DD'

  const getAuthHeader = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchManifestData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/manifest', { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        setManifestList(json.datas || json.data || []);
      }
    } catch (err) {
      console.error('Error fetching manifest for chart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManifestData();
  }, [fetchManifestData]);

  // Filter manifest list based on date range (Dari - Sampai)
  const filteredList = useMemo(() => {
    let list = manifestList;

    if (filterFrom || filterTo) {
      list = list.filter((m) => {
        const raw = m.tanggal_pelayaran || m.tanggal || m.createdAt || '';
        const d = raw.substring(0, 10); // take 'YYYY-MM-DD' part
        if (filterFrom && filterTo) return d >= filterFrom && d <= filterTo;
        if (filterFrom) return d >= filterFrom;
        if (filterTo) return d <= filterTo;
        return true;
      });
    }

    return list;
  }, [manifestList, filterFrom, filterTo]);

  // Compute stats based on filteredList
  const stats = useMemo(() => {
    const total = filteredList.length;
    const pending = filteredList.filter((m) => {
      const st = (m.status_pelayaran || m.status || '').toLowerCase();
      return st.includes('pending') || st.includes('audit');
    }).length;

    const inspeksi = filteredList.filter((m) => {
      const st = (m.status_pelayaran || m.status || '').toLowerCase();
      return st.includes('inspeksi') || st.includes('pemeriksaan');
    }).length;

    const disetujui = filteredList.filter((m) => {
      const st = (m.status_pelayaran || m.status || '').toLowerCase();
      return st.includes('setuju') || st.includes('clearance') || st.includes('selesai');
    }).length;

    const lain = Math.max(0, total - (pending + inspeksi + disetujui));

    const pendingPct = total ? Math.round((pending / total) * 100) : 0;
    const inspeksiPct = total ? Math.round((inspeksi / total) * 100) : 0;
    const disetujuiPct = total ? Math.round((disetujui / total) * 100) : 0;

    return {
      total,
      pending,
      inspeksi,
      disetujui,
      lain,
      pendingPct,
      inspeksiPct,
      disetujuiPct,
    };
  }, [filteredList]);

  // Real trend data — group filteredList by day of week
  const trendBars = useMemo(() => {
    const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayPending = [0, 0, 0, 0, 0, 0, 0];

    filteredList.forEach((m) => {
      const raw = m.tanggal_pelayaran || m.tanggal || m.createdAt || '';
      if (!raw) return;
      const date = new Date(raw);
      if (isNaN(date.getTime())) return;
      const day = date.getDay(); // 0=Min, 1=Sen, ...
      dayCounts[day]++;
      const st = (m.status_pelayaran || m.status || '').toLowerCase();
      if (st.includes('pending') || st.includes('audit')) {
        dayPending[day]++;
      }
    });

    // Reorder: Sen, Sel, Rab, Kam, Jum, Sab, Min
    const order = [1, 2, 3, 4, 5, 6, 0];
    const maxVal = Math.max(...dayCounts, 1);

    return order.map((i) => ({
      label: dayLabels[i],
      count: dayCounts[i],
      pending: dayPending[i],
      heightPct: Math.min(100, Math.max(dayCounts[i] > 0 ? 15 : 5, Math.round((dayCounts[i] / maxVal) * 100))),
    }));
  }, [filteredList]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5 sm:space-y-6 font-sans overflow-hidden">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-tight">
              Analistik Aktivitas Clearance & Inspeksi
            </h2>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
              Visualisasi distribusi status dan tren volume pelayaran real-time
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-600 border border-slate-200/60 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0284C7] shrink-0" />
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] sm:text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all cursor-pointer"
                title="Tanggal mulai"
              />
            </div>
            <span className="text-slate-400 font-bold">—</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0284C7] shrink-0" />
              <input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] sm:text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all cursor-pointer"
                title="Tanggal akhir"
              />
            </div>
            {(filterFrom || filterTo) && (
              <button
                type="button"
                onClick={() => { setFilterFrom(''); setFilterTo(''); }}
                className="px-2 py-1 rounded-lg bg-white text-red-500 hover:bg-red-50 border border-red-200 text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Distribution Cards + Right Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Status Breakdown Cards */}
        <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart size={14} className="text-[#0284C7]" />
              Distribusi Status Real-Time
            </h3>
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Total {stats.total}
            </span>
          </div>

          {/* Pending Audit Progress Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 transition-all hover:shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-900">Pending Audit</span>
              </div>
              <span className="text-xs font-extrabold text-amber-700">{stats.pending} ({stats.pendingPct}%)</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.pendingPct}%` }}
              />
            </div>
          </div>

          {/* Dalam Inspeksi Progress Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-sky-50/60 border border-sky-200/70 transition-all hover:shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#0284C7] shrink-0" />
                <span className="text-xs font-bold text-sky-900">Dalam Inspeksi</span>
              </div>
              <span className="text-xs font-extrabold text-[#0284C7]">{stats.inspeksi} ({stats.inspeksiPct}%)</span>
            </div>
            <div className="w-full bg-sky-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0284C7] h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.inspeksiPct}%` }}
              />
            </div>
          </div>

          {/* Disetujui Progress Bar */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 transition-all hover:shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-900">Clearance Disetujui</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700">{stats.disetujui} ({stats.disetujuiPct}%)</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.disetujuiPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Visual Bar Chart Trend */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 sm:p-5 flex flex-col justify-between overflow-x-auto">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <TrendingUp size={16} className="text-[#0284C7] shrink-0" />
              <h3 className="text-[11px] sm:text-xs font-extrabold text-slate-700 uppercase tracking-wider truncate">
                Tren Volume Manifest Harian
              </h3>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <ShieldCheck size={13} className="text-emerald-500" /> Live Data
            </span>
          </div>

          {/* Bar Visualization Container with Scroll Support for Ultra-Small Devices */}
          <div className="overflow-x-auto pb-1">
            <div className="h-40 sm:h-44 min-w-[280px] flex items-end justify-between gap-1.5 sm:gap-2 pt-6 pb-2 px-1 border-b border-slate-200/80">
              {trendBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-extrabold text-slate-700 bg-white px-1 py-0.5 rounded shadow-2xs border border-slate-200 whitespace-nowrap">
                    {bar.count}
                  </div>
                  <div className="w-full max-w-[24px] sm:max-w-[28px] bg-slate-200/80 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all h-full">
                    <div
                      className="w-full bg-[linear-gradient(180deg,#0284C7_0%,#0EA5E9_100%)] rounded-t-lg transition-all duration-700 group-hover:brightness-110 shadow-xs"
                      style={{ height: `${bar.heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 group-hover:text-[#0284C7] transition-colors truncate">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Footer Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-3 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Volume
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Terakhir diperbarui: Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
