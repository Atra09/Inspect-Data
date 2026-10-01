# CaloKapal - Sistem Inspeksi Manifest KTP Penumpang (KSOP)

Proyek ini merupakan sistem inspeksi, audit manifest, dan verifikasi KTP penumpang pelabuhan yang dirancang khusus untuk **Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)**.

---

## 📚 Dokumen Mandatori AI Agent & Developer (Wajib Dibaca)

Sebelum membaca, membuat, atau mengubah kode apapun di dalam repositori ini, AI Agent dan Developer **WAJIB** membaca dokumen berikut:

1. [📋 PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md) - Cetak biru arsitektur lengkap, alur bisnis, spesifikasi UI kamera, performa, dan regulasi keamanan UU PDP.
2. [🤖 AI_RULES.md](AI_RULES.md) - Aturan wajib bebas *spaghetti code*, protokol analisa sebelum edit kode, komponen reusable, dan standar keamanan tinggi.

---

## 📁 Struktur Utama Proyek (Modular & Terpisah)

```text
d:\Magang\App\CaloKapal\
├── mobile/                 <-- Frontend App Mobile Flutter Petugas KSOP (PORT 3003)
├── backend/                <-- Backend API Express.js Node.js (PORT 3003)
├── web/                    <-- Web Dashboard Audit Kantor KSOP
├── PROJECT_BLUEPRINT.md    <-- Blueprint Utama Sistem
├── AI_RULES.md             <-- Aturan Wajib AI Agent / Developer
└── README.md               <-- Indeks Proyek
```

---

## ⚡ Prinsip Utama Proyek
- **Ringan & Kencang**: OCR KTP berjalan di level Edge (Native ML Kit Offline), Backend Express MVC cepat & efisien.
- **Bebas Spaghetti Code**: Mengutamakan Reusable Components, DRY (Don't Repeat Yourself), dan Pemisahan Tugas (SRP).
- **Keamanan Tinggi**: Proteksi JWT, Sanitasi Input, dan Watermark Foto KTP (UU PDP).
