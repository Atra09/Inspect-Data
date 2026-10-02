# 🗄️ HASIL INSPEKSI LIVE DATABASE MYSQL `db_calokapal`

*Dokumen ini dibuat otomatis dari hasil query langsung (`SHOW TABLES` & `DESCRIBE`) ke server MySQL lokal.* 

**Status Koneksi**: 🟢 TERHUBUNG ke `db_calokapal` di `localhost`

## 📊 DAFTAR TABEL DI DATABASE LIVE (14 TABEL)

### 📋 Tabel: `agen` (Total Data: 11 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_agen` | `int` | NO | PRI | null | auto_increment |
| `nama_agen` | `varchar(255)` | YES | UNI | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `asal_kapal` (Total Data: 35 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_asal_kapal` | `int` | NO | PRI | null | auto_increment |
| `nama_asal_kapal` | `varchar(255)` | YES | UNI | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `jenis` (Total Data: 11 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_jenis` | `int` | NO | PRI | null | auto_increment |
| `nama_jenis` | `varchar(255)` | YES | - | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `kapal` (Total Data: 131 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_kapal` | `int` | NO | PRI | null | auto_increment |
| `nama_kapal` | `varchar(255)` | YES | UNI | null | - |
| `id_jenis` | `int` | YES | MUL | null | - |
| `id_bendera` | `int` | YES | MUL | null | - |
| `gt` | `int` | YES | - | null | - |
| `nt` | `int` | YES | - | null | - |
| `nomor_selar` | `int` | YES | - | null | - |
| `tanda_selar` | `varchar(255)` | YES | - | null | - |
| `nomor_imo` | `varchar(255)` | YES | - | null | - |
| `call_sign` | `varchar(255)` | YES | - | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |
| `id_asal_kapal` | `int` | YES | MUL | null | - |

### 📋 Tabel: `kecamatan` (Total Data: 50 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_kecamatan` | `int` | NO | PRI | null | auto_increment |
| `nama_kecamatan` | `varchar(255)` | YES | UNI | null | - |
| `id_kabupaten` | `int` | YES | MUL | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `manifest` (Total Data: 0 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_manifest` | `int` | NO | PRI | null | auto_increment |
| `no_urut` | `varchar(255)` | YES | - | null | - |
| `id_kapal` | `int` | YES | MUL | null | - |
| `id_nahkoda` | `int` | YES | MUL | null | - |
| `jumlah_crew` | `int` | YES | - | null | - |
| `id_kedudukan_kapal` | `int` | YES | MUL | null | - |
| `tanggal_datang` | `date` | YES | - | null | - |
| `id_datang_dari` | `int` | YES | MUL | null | - |
| `tanggal_berangkat` | `date` | YES | - | null | - |
| `id_tempat_singgah` | `int` | YES | MUL | null | - |
| `id_tujuan_akhir` | `int` | YES | MUL | null | - |
| `id_tolak` | `int` | YES | MUL | null | - |
| `id_sandar` | `int` | YES | MUL | null | - |
| `id_agen` | `int` | YES | MUL | null | - |
| `tanggal_clearance` | `date` | YES | - | null | - |
| `pukul_agen_clearance` | `time` | YES | - | null | - |
| `pukul_kapal_berangkat` | `varchar(255)` | YES | - | null | - |
| `status_muatan_berangkat` | `enum('NIHIL','SESUAI MANIFEST')` | YES | - | null | - |
| `penumpang_turun` | `int` | YES | - | null | - |
| `penumpang_naik` | `int` | YES | - | null | - |
| `wilayah_kerja` | `enum('dungkek','pusat')` | YES | - | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |
| `status_pelayaran` | `varchar(100)` | YES | - | TERBIT | - |
| `id_status_pelayaran` | `int` | YES | MUL | null | - |

### 📋 Tabel: `nahkoda` (Total Data: 158 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_nahkoda` | `int` | NO | PRI | null | auto_increment |
| `nama_nahkoda` | `varchar(255)` | YES | UNI | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `negara` (Total Data: 1 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_negara` | `int` | NO | PRI | null | auto_increment |
| `nama_negara` | `varchar(255)` | YES | UNI | null | - |
| `kode_negara` | `varchar(255)` | YES | UNI | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `pelabuhan` (Total Data: 12 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_pelabuhan` | `int` | NO | PRI | null | auto_increment |
| `nama_pelabuhan` | `varchar(255)` | YES | UNI | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `spb` (Total Data: 0 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_spb` | `int` | NO | PRI | null | auto_increment |
| `no_spb` | `varchar(255)` | YES | - | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |



### 📋 Tabel: `status_pelayaran` (Total Data: 3 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_status` | `int` | NO | PRI | null | auto_increment |
| `kode_status` | `varchar(255)` | NO | UNI | null | - |
| `nama_status` | `varchar(255)` | NO | - | null | - |
| `deskripsi` | `text` | YES | - | null | - |
| `badge_color` | `varchar(255)` | NO | - | emerald | - |
| `is_default` | `tinyint(1)` | NO | - | 0 | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |

### 📋 Tabel: `users` (Total Data: 3 baris)
| Field | Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id_user` | `int` | NO | PRI | null | auto_increment |
| `username` | `varchar(255)` | YES | - | null | - |
| `password` | `varchar(255)` | YES | - | null | - |
| `nama_lengkap` | `varchar(255)` | YES | - | null | - |
| `email` | `varchar(255)` | YES | - | null | - |
| `no_hp` | `varchar(255)` | YES | - | null | - |
| `jabatan` | `varchar(255)` | YES | - | null | - |
| `wilayah_kerja` | `varchar(255)` | YES | - | null | - |
| `foto` | `varchar(255)` | YES | - | null | - |
| `role` | `enum('user','koordinator','superuser')` | YES | - | null | - |
| `createdAt` | `datetime` | NO | - | null | - |
| `updatedAt` | `datetime` | NO | - | null | - |
