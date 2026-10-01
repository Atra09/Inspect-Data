# PROJECT BLUEPRINT: SISTEM AUDIT & VERIFIKASI MANIFEST PENUMPANG KAPAL (KSOP)

> **DOKUMEN UTAMA ARSITEKTUR & REGULASI SISTEM**  
> *Sistem Inspeksi Mandiri Otoritas Kesyahbandaran dan Otoritas Pelabuhan (KSOP) untuk Eliminasi Calo, Penumpang Gelap, dan Verifikasi Keamanan Pelayaran.*

---

## 1. Konteks Bisnis & Peran Organisasi (KSOP Context)

1. **Peran KSOP**: KSOP adalah **Regulator / Pengawas Independen Keselamatan Pelayaran**, BUKAN penjual tiket dan BUKAN operator kapal.
2. **Latar Belakang & Legalitas**: 
   - KSOP memegang wewenang penuh penerbitan **Surat Persetujuan Berlayar (SPB)**.
   - Jika terjadi musibah kecelakaan kapal di laut, KSOP sering disalahkan jika ada ketidaksesuaian manifest.
   - Aplikasi ini dibangun sebagai **Perisai Hukum & Alat Pembuktian Fisik Otentik KSOP** berdasarkan foto KTP asli penumpang yang benar-benar fisik naik di dermaga.
3. **Pemberantasan Calo**: Mengidentifikasi praktek jual-beli tiket tanpa ubah nama, penggunaan identitas palsu, atau akumulasi penumpang tak terdaftar.

---

## 2. Alur Operasional Sistem (End-to-End Workflow)

Sistem bekerja berdasarkan urutan operasional berikut:

### Tahap 1: Inspeksi Lapangan di Dermaga (Gangway Inspection)
- Petugas KSOP bertugas di pintu naik kapal (*gangway*).
- Petugas membuka **Aplikasi Mobile Inspeksi KSOP (Flutter)**.
- Petugas memilih / scan QR Sesi Kapal yang sedang dijaga (misal: `KM Express Bahari - 08:00 WIB`).
- Petugas memfoto KTP fisik setiap penumpang yang masuk.
- **Engine AI (Edge OCR)** membaca NIK & Nama dari KTP secara instant ($\approx 1-2$ detik) tanpa mengganggu kecepatan boarding.
- Data Foto KTP + Teks OCR tersimpan ke memori HP (mendukung mode **Offline-First**).

### Tahap 2: Selesai Boarding & Penyerahan Laporan Kapal
- Setelah semua penumpang masuk, pihak Operator/Agen Kapal mengunggah **Laporan Manifest Kapal** (Excel/CSV/Form Web) ke sistem KSOP.
- Petugas KSOP di HP menekan tombol **"Selesai Boarding"** untuk mengunggah seluruh batch foto KTP ke server KSOP.

### Tahap 3: Automated Cross-Matching Engine (Pencocokan Otomatis Kantor KSOP)
Sistem di server kantor secara otomatis menyandingkan data:
1. **Pemeriksaan Kuantitas (Jumlah Penumpang)**:
   - Total Laporan Kapal vs Total Foto KTP Temuan Petugas KSOP.
2. **Pemeriksaan Identitas (Cross-Check NIK & Nama)**:
   - Match (Hijau): NIK/Nama di KTP sesuai 100% dengan Laporan Kapal.
   - Mismatch / Alert (Merah): NIK/Nama KTP tidak ditemukan di Laporan Kapal (Praktek Calo / Penumpang Gelap) ATAU nama di laporan kapal yang tidak ada foto KTP-nya.

### Tahap 4: Keputusan Penerbitan SPB / Audit Trail
- Syahbandar meninjau layar dashboard audit.
- Jika Valid: Recommendation SPB diterbitkan.
- Jika Mismatch: Kapal ditahan (*Hold Departure*) hingga manifest disesuaikan.

---

## 3. Spesifikasi UI/UX Kamera & Manajemen Sesi Kapal

### A. Badge Layout Kamera (Active Ship Badge)
Di layar kamera aplikasi mobile petugas:
- **Header Layout / Badge**: Menampilkan kotak informasi mengambang:
  ```text
  [ 🟢 MENJAGA: KM EXPRESS BAHARI | 08:00 WIB | Total: 380 Orgs ]
  ```
- **Fungsi Interaktif Badge saat Ditekan**:
  1. Menampilkan **Total Real-Time Scanned**: Jumlah akumulasi seluruh foto KTP yang diambil oleh **SEMUA petugas KSOP** yang sedang bertugas di kapal tersebut secara *real-time*.
  2. Menampilkan **Daftar Petugas Aktif**: Siapa saja petugas KSOP yang sedang bersama-sama menjaga kapal ini.
  3. **Tombol "Ganti Kapal / Batal"**: Memungkinkan perpindahan sesi jika petugas salah memilih kapal di awal (dengan konfirmasi).

### B. Siklus Hidup Sesi (Session Lifecycle & Locking)
1. **Locking**: Saat sesi dipilih, aplikasi TERKUNCI pada sesi kapal tersebut untuk mencegah kesalahan pencampuran foto kapal lain.
2. **Multi-Officer Data Merge**: Data dari Petugas A (tangga depan) dan Petugas B (tangga belakang) pada sesi kapal yang sama otomatis digabungkan oleh server.
3. **Manual Finalize**: Tombol `SELESAI BOARDING KAPAL INI` untuk menutup sesi secara manual setelah gangway diangkat.
4. **Auto-Timeout Safety Net**: Sesi otomatis terkunci/selesai jika tidak ada aktivitas foto selama 30-45 menit pasca jadwal keberangkatan atau mencapai batas 3 jam.

---

## 4. Arsitektur Teknis, Performa & Keamanan

### A. Arsitektur Komponen
```text
[ Mobile App KSOP (Flutter) ]
   ├── Edge AI OCR (Google ML Kit Text Recognition Native)
   ├── Offline Storage (SQLite / Hive)
   └── Background Sync Engine
            │
            ▼ REST API (PORT 3003)
[ Server Backend KSOP (Node.js Express) ]
   ├── Config & Middleware (JWT, Uploads, Security)
   ├── Controllers (Modular Business Logic)
   ├── Models (Sequelize ORM MySQL)
   └── Utils & Components (ApiResponse, Reusable Matcher Engine)
```

### B. Standar Performa & Keamanan
1. **Ultra-Fast & Ringan**:
   - Flutter dikompilasi langsung ke Native C++ machine code.
   - OCR dijalankan 100% offline di HP menggunakan Google Play Services NNAPI.
   - Server Backend Express berjalan pada **PORT 3003** dengan async I/O non-blocking.
2. **Keamanan Data & Regulasi UU PDP**:
   - Foto KTP & NIK dienkripsi saat *transit* & *rest*.
   - Autentikasi berbasis JWT Token.
   - Penambahan Watermarking Transparan Otomatis pada foto KTP.
