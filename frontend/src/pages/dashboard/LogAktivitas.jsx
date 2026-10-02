import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Filter,
  Trash2,
  ArrowLeft,
  X,
  Clock,
  Laptop,
  CheckCircle2,
  PlusCircle,
  Edit3,
  LogIn,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';
import DataTable from '../../component/ui/DataTable';
import Flash from '../../component/notif/flash';

export default function LogAktivitas() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aksiFilter, setAksiFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [toast, setToast] = useState(null);

  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isSuperUser = currentUser.role === 'superuser' || currentUser.role === 'admin';

  const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/log-aktivitas', { headers });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.datas || json.data || []);
      } else {
        setToast({ message: 'Gagal memuat log aktivitas dari server', type: 'error' });
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setToast({ message: 'Terjadi kesalahan koneksi server', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle Clear All Logs (Superuser only)
  const handleClearLogs = async () => {
    if (
      !window.confirm(
        'Apakah Anda yakin ingin menghapus SELURUH riwayat log aktivitas? Tindakan ini tidak dapat dibatalkan.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/log-aktivitas/clear', {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        setToast({ message: 'Seluruh log aktivitas berhasil dibersihkan!', type: 'success' });
        setLogs([]);
      } else {
        setToast({ message: 'Gagal membersihkan log aktivitas', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan server saat membersihkan log', type: 'error' });
    }
  };

  // Filter logs by Aksi filter dropdown
  const filteredLogs = useMemo(() => {
    if (aksiFilter === 'All') return logs;
    return logs.filter((l) => l.aksi === aksiFilter);
  }, [logs, aksiFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getAksiBadge = (aksi) => {
    switch (aksi) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PlusCircle size={12} /> CREATE
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-50 text-[#0284C7] border border-sky-200">
            <Edit3 size={12} /> UPDATE
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <Trash2 size={12} /> DELETE
          </span>
        );
      case 'LOGIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
            <LogIn size={12} /> LOGIN
          </span>
        );
      case 'INSPEKSI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <Activity size={12} /> INSPEKSI
          </span>
        );
      case 'VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 size={12} /> VERIFIKASI
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            {aksi}
          </span>
        );
    }
  };

  const getEntitasBadge = (entitas) => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Layers size={11} className="text-[#0284C7]" /> {entitas}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        label: 'Waktu',
        sortable: true,
        render: (val) => (
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold whitespace-nowrap">
            <Clock size={13} className="text-[#0284C7] shrink-0" />
            <span>{formatDate(val)}</span>
          </div>
        ),
      },
      {
        key: 'username',
        label: 'User & Role',
        sortable: true,
        render: (_, item) => {
          const userName = item.nama_user || item.user?.nama_lengkap || item.username || 'System';
          const userRole = item.role || item.user?.role || 'user';
          return (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-800">{userName}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  @{item.username || 'system'} • {userRole}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'aksi',
        label: 'Aksi',
        sortable: true,
        className: 'text-center',
        render: (val) => getAksiBadge(val),
      },
      {
        key: 'entitas',
        label: 'Entitas',
        sortable: true,
        className: 'text-center',
        render: (val) => getEntitasBadge(val),
      },
      {
        key: 'keterangan',
        label: 'Keterangan / Detail Aktivitas',
        render: (val) => (
          <span className="font-medium text-slate-700 max-w-xs block truncate" title={val}>
            {val || '-'}
          </span>
        ),
      },
      {
        key: 'ip_address',
        label: 'IP Address',
        className: 'text-center font-mono text-[11px] text-slate-500',
        render: (val) => (
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Laptop size={12} className="text-slate-400" /> {val || '127.0.0.1'}
          </span>
        ),
      },
      {
        key: 'aksi_detail',
        label: 'Detail',
        className: 'text-center w-16',
        render: (_, item) => (
          <button
            type="button"
            onClick={() => setSelectedLog(item)}
            className="p-1.5 rounded-lg bg-sky-50 text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
            title="Lihat Detail Log"
          >
            <Eye size={15} />
          </button>
        ),
      },
    ],
    []
  );

  const filterActions = (
    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0284C7] transition-all shadow-2xs">
        <Filter size={14} className="text-[#0284C7] shrink-0" />
        <select
          value={aksiFilter}
          onChange={(e) => setAksiFilter(e.target.value)}
          className="bg-transparent font-extrabold text-slate-800 border-none focus:outline-none cursor-pointer text-xs"
        >
          <option value="All">Semua Aksi</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="INSPEKSI">INSPEKSI</option>
          <option value="VERIFIKASI">VERIFIKASI</option>
        </select>
      </div>

      {isSuperUser && logs.length > 0 && (
        <button
          type="button"
          onClick={handleClearLogs}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Trash2 size={14} />
          <span>Bersihkan Log</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      <Flash toast={toast} onClose={() => setToast(null)} />

      {/* Header Navigation & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0284C7] font-semibold mb-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Log Aktivitas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail riwayat aktivitas dan perubah data sistem
          </p>
        </div>
      </div>

      {/* Main DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        isLoading={loading}
        searchPlaceholder="Cari Username, Keterangan, IP..."
        actions={filterActions}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyMessage="Tidak ada riwayat aktivitas log yang cocok dengan filter"
      />

      {/* Detail Modal Popup */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-sky-200" />
                <h3 className="font-extrabold text-sm tracking-tight">
                  Detail Audit Log #{selectedLog.id_log}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Aksi & Modul Entitas
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {getAksiBadge(selectedLog.aksi)}
                    {getEntitasBadge(selectedLog.entitas)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Waktu Kejadian
                  </span>
                  <span className="font-bold text-slate-700 mt-0.5 block">
                    {formatDate(selectedLog.createdAt)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Pengguna
                  </span>
                  <span className="font-extrabold text-slate-800 mt-0.5 block">
                    {selectedLog.nama_user ||
                      selectedLog.user?.nama_lengkap ||
                      selectedLog.username ||
                      'System'}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    @{selectedLog.username || 'system'} ({selectedLog.role || 'user'})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    IP Address User
                  </span>
                  <span className="font-extrabold text-slate-800 font-mono mt-0.5 block">
                    {selectedLog.ip_address || '127.0.0.1'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Rincian Keterangan Aktivitas
                </span>
                <p className="text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                  {selectedLog.keterangan || '-'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="py-2 px-5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
