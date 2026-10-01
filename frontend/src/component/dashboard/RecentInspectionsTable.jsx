import React, { useState } from 'react';
import { Ship, Eye, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import ActionMenu from '../common/ActionMenu';

export default function RecentInspectionsTable() {
  const [filterStatus, setFilterStatus] = useState('All');

  const inspectionsData = [
    {
      id: 'SPB-2026-0091',
      vessel: 'KM Mulia Rahayu',
      imo: 'IMO 982143',
      cargo: 'General Cargo',
      agent: 'PT Bahari Nusantara',
      time: '10:45 WIB',
      status: 'Disetujui',
      statusType: 'success',
    },
    {
      id: 'SPB-2026-0090',
      vessel: 'KM Sumber Laut 02',
      imo: 'IMO 974120',
      cargo: 'BBM / Tangker',
      agent: 'PT Pelayaran Mandiri',
      time: '09:15 WIB',
      status: 'Dalam Inspeksi',
      statusType: 'process',
    },
    {
      id: 'SPB-2026-0089',
      vessel: 'KM Nusantara Jaya',
      imo: 'IMO 965411',
      cargo: 'Sembako & Hasil Tani',
      agent: 'CV Samudra Indah',
      time: '08:30 WIB',
      status: 'Pending Audit',
      statusType: 'warning',
    },
    {
      id: 'SPB-2026-0088',
      vessel: 'KM Bintang Bahari',
      imo: 'IMO 951230',
      cargo: 'Kayu Olahan',
      agent: 'PT Lautan Berlian',
      time: 'Kemarin, 16:20',
      status: 'Disetujui',
      statusType: 'success',
    },
  ];

  const filteredData =
    filterStatus === 'All'
      ? inspectionsData
      : inspectionsData.filter((item) => item.status === filterStatus);

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
      label: 'No. Registrasi SPB',
      sortable: true,
      className: 'font-extrabold text-[#0284C7]',
    },
    {
      key: 'vessel',
      label: 'Nama Kapal / IMO',
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
      label: 'Waktu Inspeksi',
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
            row={row}
            actions={[
              {
                label: 'Lihat Detail',
                icon: Eye,
                onClick: (r) => alert(`Detail SPB: ${r.id} - ${r.vessel}`),
              },
            ]}
            onEdit={(r) => alert(`Edit SPB: ${r.id}`)}
            onDelete={(r) => alert(`Hapus SPB: ${r.id}`)}
          />
        </div>
      ),
    },
  ];

  // Custom Header Filters Action for DataTable Toolbar
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
            Daftar permohonan Surat Persetujuan Berlayar (SPB) KSOP
          </p>
        </div>
      </div>

      {/* Universal Responsive DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Cari Kapal, No. SPB, Agen..."
        actions={filterActions}
        pageSize={5}
      />
    </div>
  );
}

