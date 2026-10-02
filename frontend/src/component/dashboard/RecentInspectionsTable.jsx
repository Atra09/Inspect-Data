import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Eye, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import ActionMenu from '../common/ActionMenu';

export default function RecentInspectionsTable() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInspections = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch('/api/manifest', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const resData = await res.json();
        const raw = resData.datas || resData.data || [];
        
        const mapped = raw.map((item) => {
          const statusInspeksi = item.status_inspeksi;
          let statusLabel = 'Dalam Inspeksi';
          let statusType = 'process';

          if (statusInspeksi === 'selesai') {
            statusLabel = 'Disetujui';
            statusType = 'success';
          } else if (statusInspeksi === 'pending') {
            statusLabel = 'Pending Audit';
            statusType = 'warning';
          }

          return {
            raw: item,
            id: item.no_urut ? `${item.no_urut}` : `REG-${item.id_manifest}`,
            vessel: item.nama_kapal || item.kapal?.nama_kapal || '-',
            imo: item.kapal?.gt_kapal ? `GT ${item.kapal.gt_kapal}` : 'Kapal KSOP',
            cargo: item.status_muatan_berangkat || 'General Cargo',
            agent: item.nama_agen || item.agen?.nama_agen || item.nama_nahkoda || item.nahkoda?.nama_nahkoda || '-',
            time: item.pukul_kapal_berangkat || item.pukul_agen_clearance || 'WIB',
            status: statusLabel,
            statusType,
          };
        });

        setDataList(mapped);
      } else {
        setDataList([]);
      }
    } catch (err) {
      console.error('Fetch Inspections Error:', err);
      setDataList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const filteredData =
    filterStatus === 'All'
      ? dataList
      : dataList.filter((item) => item.status === filterStatus);

  const getStatusBadge = (type, label) => {
    switch (type) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle size={14} className="text-emerald-500" />
            {label}
          </span>
        );
      case 'process':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
            <Clock size={14} className="text-sky-500 animate-spin" />
            {label}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <AlertCircle size={14} className="text-amber-500" />
            {label}
          </span>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'No. Registrasi',
      sortable: true,
      className: 'font-extrabold text-[#0284C7]',
      render: (val, row) => (
        <span
          onClick={() => row.raw?.id_manifest && navigate(`/manifest/detail/${row.raw.id_manifest}`)}
          className="hover:underline cursor-pointer"
        >
          {val}
        </span>
      ),
    },
    {
      key: 'vessel',
      label: 'Nama Kapal',
      sortable: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{val}</span>
          <span className="text-[10px] text-slate-400">{row.imo}</span>
        </div>
      ),
    },
    {
      key: 'agent',
      label: 'Agen / Nahkoda',
      sortable: true,
      className: 'font-medium text-slate-600',
    },
    {
      key: 'cargo',
      label: 'Kategori Muatan',
      sortable: true,
      className: 'font-semibold text-slate-700',
    },
    {
      key: 'time',
      label: 'Waktu Clearance',
      sortable: true,
      className: 'text-slate-500 font-medium',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      className: 'text-center',
      render: (val, row) => getStatusBadge(row.statusType, val),
    },
    {
      key: 'actions',
      label: 'Aksi',
      className: 'text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center">
          <ActionMenu
            row={row.raw}
            onView={(r) => r?.id_manifest && navigate(`/manifest/detail/${r.id_manifest}`)}
            onEdit={(r) => r?.id_manifest && navigate(`/manifest/edit/${r.id_manifest}`)}
          />
        </div>
      ),
    },
  ];

  const filterActions = (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
      {['All', 'Disetujui', 'Dalam Inspeksi', 'Pending Audit'].map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => setFilterStatus(status)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 outline-none cursor-pointer ${
            filterStatus === status
              ? 'bg-[#0284C7] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Ship size={20} className="text-[#0284C7]" />
            Aktivitas Inspeksi & Clearance Terbaru
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar permohonan clearance dan inspeksi KSOP
          </p>
        </div>
      </div>

      {/* Universal Responsive DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchPlaceholder="Cari Kapal, No. Register, Agen..."
        actions={filterActions}
        pageSize={5}
        emptyMessage="Belum ada aktivitas inspeksi pelayaran"
      />
    </div>
  );
}
