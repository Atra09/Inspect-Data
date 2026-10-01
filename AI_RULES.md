# 📋 AI_RULES: Standar Pengembangan Backend, Frontend & Architecture Blueprint (Clearance Standard)

Dokumen ini berisi standar penulisan kode, arsitektur, dan pola pengembangan sistem untuk proyek **CaloKapal** yang disesuaikan secara 100% presisi dengan proyek acuan **Manajemen-Clearance-Kapal-Tradisional**, dengan tetap memprioritaskan kejujuran, performa tinggi, efisiensi memori, serta responsitivitas yang ringan dan cepat.

---

## 📌 1. Prinsip Utama (Core Principles)

1. **Ringan & Cepat (Lightweight & High Performance)**:
   - **Backend**: Hindari query `SELECT *` yang tidak perlu pada tabel berukuran besar; selalu seleksi atribut spesifik menggunakan opsi `attributes: [...]`. Hindari eksekusi query N+1 via `include` Sequelize seefisien mungkin. Respon JSON dibuat seringkas dan sesimpel mungkin.
   - **Frontend**: Hindari *spaghetti code* dan komponen monolithic raksasa. Pisahkan logika manajemen state dan tampilan komponen UI secara bersih. Gunakan throttled/debounced event listener untuk aktivitas berat agar CPU/memori tetap efisien.

2. **Konsistensi Arsitektur MVC & Modul (Clearance Standard)**:
   - Struktur folder dan penamaan file wajib mengikuti pola proyek acuan `Manajemen-Clearance-Kapal-Tradisional`.
   - Model mendefinisikan skema tabel, `association.js` mengelola seluruh relasi terpusat, Controller menangani logika bisnis, dan Router mengurus pemetaan endpoint API.

3. **Keamanan, Isolasi Sesi & Proteksi Tab**:
   - Autentikasi berbasis JWT (`jsonwebtoken`) melalui HTTP Header `Authorization: Bearer <token>`.
   - **Isolasi Sesi Per Tab/Browser (`sessionStorage`)**: Menyimpan `token` dan data sesi pengguna secara eksklusif di `sessionStorage` (bukan `localStorage`) agar sesi terisolasi penuh dan tidak bocor antar tab atau jendela browser yang berbeda.
   - **Auto-Logout Inaktivitas 30 Menit**: Jika pengguna tidak memiliki aktivitas selama **30 menit** (1.800.000 ms), sesi dianggap kadaluarsa, pengguna di-logout otomatis, dan diarahkan ke halaman login dengan notifikasi toast.

4. **Standar Notifikasi UI (`Flash.jsx`)**:
   - Penggunaan komponen notifikasi toast terpusat `Flash.jsx` untuk menampilkan balasan sukses (`success`), galat (`error`), dan peringatan (`warning` / `info`).

---

## 🏗️ 2. Struktur Direktori Sistem (Backend & Frontend)

```
CaloKapal/
├── backend/
│   ├── bin/
│   │   └── www                 # HTTP Server Entry Point (Port listener & Error handler)
│   ├── config/
│   │   └── db.js               # Inisialisasi Sequelize Instance & async configDb()
│   ├── controller/             # Logika Bisnis & Request Handlers (misal: userController.js, kapalController.js)
│   ├── middleware/
│   │   ├── jwt.js              # Token verification middleware (verifyToken)
│   │   └── authorization.js    # Role-based authorization middleware (adminAuth, semiAdminAuth, userAuth)
│   ├── model/
│   │   ├── association.js      # Pemusatan & Pengaturan Seluruh Relasi Sequelize
│   │   └── *Model.js           # Definisi Tabel / Model Sequelize (misal: userModel.js, kapalModel.js)
│   ├── routes/                 # Express Routers (misal: users.js, auth.js, kapal.js)
│   ├── .env                    # Environment Variables (DB_NAME, DB_HOST, JWT_SECRET, API_URL)
│   └── app.js                  # Middleware Express, Route Mounting, & Database Sync Initializer
│
└── frontend/
    └── src/
        ├── api/
        │   └── axiosInstance.js # Interceptor Axios dengan otomatisasi Header Bearer Token
        ├── component/
        │   └── notif/
        │       └── flash.jsx    # Standar Toast Notification (success, error, warning, info)
        ├── context/
        │   └── AuthContext.jsx  # Context Autentikasi, Isolasi Sesi & Listener Inaktivitas 30 Menit
        └── pages/
            └── auth/
                └── login.jsx    # Halaman Login yang terhubung ke Backend & Flash Notification
```

---

## ⚙️ 3. Standar Konfigurasi Database & Environment

### 📄 `.env`
```env
API_URL = localhost
JWT_SECRET = caloKapalmogaadabayaran
DB_NAME = db_calokapal
DB_USERNAME = root
DB_PASSWORD = 
DB_HOST = localhost
```

### 🛠️ `config/db.js`
```javascript
const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME || 'db_calokapal',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Disarankan false agar konsol tetap bersih dan cepat
  }
);

const configDb = async () => {
  try {
    await db.authenticate();
    console.log('🟢 DATABASE CONNECTED SUCCESSFULLY (db_calokapal)');
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:', error.message);
  }
};

module.exports = { db, configDb };
```

---

## 📐 4. Standar Pemodelan Data & Relasi (`model/`)

### 🔹 Definisi Model (`model/[namaTabel]Model.js`)
- **File Naming**: CamelCase dengan akhiran `Model.js` (contoh: `userModel.js`, `kapalModel.js`).
- **Primary Key**: Menggunakan nama `id_[namaTabel]` (`id_user`, `id_kapal`).
- **Struktur Kode**:
  ```javascript
  const { DataTypes } = require("sequelize");
  const { db } = require("../config/db");

  const users = db.define("users", {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    email: DataTypes.STRING,
    no_hp: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    wilayah_kerja: DataTypes.STRING,
    foto: DataTypes.STRING,
    role: DataTypes.ENUM("user", "koordinator", "superuser"),
  });

  module.exports = users;
  ```

### 🔹 Pemusatan Relasi (`model/association.js`)
Seluruh relasi antar-tabel wajib didefinisikan secara terpusat di `model/association.js`:
```javascript
const users = require("./userModel");
const kapal = require("./kapalModel");

module.exports = { users, kapal };
```

---

## 🎮 5. Standar Penulisan Controller (`controller/`)

### 🔹 Penamaan File & Fungsi Handler
- **File Naming**: `[namaEntitas]Controller.js` (contoh: `userController.js`, `kapalController.js`).
- **Function Naming**:
  - `login` -> Autentikasi pengguna, verifikasi bcrypt, dan pembuatan JWT
  - `get[Entitas]` -> Mendapatkan semua data (support `search` via query string)
  - `get[Entitas]ById` -> Mendapatkan data berdasarkan Primary Key ID
  - `store[Entitas]` -> Menambahkan data baru (dengan password hashing untuk user)
  - `update[Entitas]` -> Memperbarui data yang ada
  - `delete[Entitas]` -> Menghapus data

### 🔹 Pola Respons JSON & Handling
- **Status 200 OK**: `{ msg: "Berhasil mengambil data", datas / data / token }`
- **Status 401 Unauthorized**: `{ msg: "Username / password tidak sesuai" }`
- **Status 500 Error (Bad Request / Null)**: `{ msg: "data tidak ditemukan" }`
- **Catch Block Error**: `{ msg: "terjadi kesalahan pada fungsi" }`

---

## 🔐 6. Standar Middleware & Keamanan (`middleware/`)

### 🔹 Token Verification (`middleware/jwt.js`)
```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "tidak ada akses" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ msg: "invalid / expired token" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada fungsi jwt" });
  }
};

module.exports = verifyToken;
```

### 🔹 Role Authorization (`middleware/authorization.js`)
- `adminAuth`: Otorisasi terbatas hanya untuk role `superuser`.
- `semiAdminAuth`: Otorisasi untuk role `koordinator` dan `superuser`.
- `userAuth`: Otorisasi pengguna sesuai ID milik sendiri atau `superuser`.

---

## 🛣️ 7. Standar Penulisan Router (`routes/`)

- **File Naming**: Nama entitas singular / plural (contoh: `users.js`, `auth.js`, `kapal.js`).
- **Clean 1-Line Import Format**: Gunakan penulisan destructuring ringkas 1 baris untuk keterbacaan berkas yang rapi.
- **Routing Conventions**:
  ```javascript
  var express = require('express');
  var router = express.Router();
  const verifyToken = require('../middleware/jwt');
  const { storeUser, getUser, updateUser, getUserById, deleteUser, login, changePassword } = require('../controller/userController');
  const { userAuth, adminAuth } = require('../middleware/authorization');

  router.post('/login', login);

  router.use(verifyToken);

  router.get('/', adminAuth, getUser);
  router.get('/:id', userAuth, getUserById);
  router.post('/store', adminAuth, storeUser);
  router.patch('/update/:id', userAuth, updateUser);
  router.delete('/delete/:id', userAuth, deleteUser);

  module.exports = router;
  ```

---

## 💡 8. Standar Frontend, Session & Notifications

1. **Penggunaan `sessionStorage` Khusus**:
   - Untuk mencegah kebocoran sesi di tab atau browser lain, data `token` dan `user` disimpan pada `sessionStorage`.
   - `localStorage` dibersihkan pada saat logout/login untuk menjamin isolasi penuh.

2. **Bebas Spaghetti Code**:
   - Hindari penggabungan banyak variabel state mentah yang tidak perlu di dalam satu komponen UI.
   - Gunakan `AuthContext` untuk logika global (sesi, inaktivitas, toast) dan komponen terpisah seperti `Flash.jsx` untuk notifikasi.

3. **Inaktivitas 30 Menit**:
   - Event listener aktivitas pengguna di-throttle (misal: perbarui `sessionStorage.setItem('lastActivity')` maksimal sekali setiap 10 detik).
   - Jika inaktif selama **30 menit**, pengguna di-logout otomatis dan diberikan pesan flash: `"Sesi Anda telah habis, silahkan login kembali!"`.

---

## ⚡ 9. Ringkasan Aturan Utama Pengodean (Dev Guidelines)

1. **Kejujuran & Ketelitian Utama**: Bebas dari rekayasa atau asumsi; seluruh alur wajib diuji dan terverifikasi secara presisi.
2. **Selalu Gunakan Async/Await & Try-Catch** pada setiap controller handler.
3. **Standardized Status Code & Key Response**: `res.status(200).json({ msg: "...", datas })` untuk list data, `data` untuk single object data.
4. **Pemusatan Model & Relasi**: Semua relasi `hasMany` / `belongsTo` diletakkan di `model/association.js`.
5. **Isolasi Environment & Sesi**: Tidak boleh memasukkan kredensial database hardcoded di berkas JS. Gunakan `.env` dan `sessionStorage`.
6. **Performa Pertama (Performance First)**: Selalu utamakan sintaksis yang efisien dan pergerakan data yang ringan untuk pengalaman pengguna yang cepat dan responsif.

---

## 📶 10. Standar Konektivitas Mobile & Penanganan Network Error

1. **Penggunaan Native Browser `fetch()` pada Request Autentikasi/API**:
   - Untuk mencegah exception `Error: Network Error` pada browser mobile (Chrome Android & iOS Safari) saat aplikasi diakses via IP Wi-Fi lokal (misal: `http://192.168.1.x`), gunakan **Native `fetch('/api/...')`** bawaan browser.
   - Native `fetch` diproses langsung oleh mesin jaringan bawaan browser tanpa adapter perantara, sehingga URL relatif `/api` otomatis tersolusikan dengan lancar pada port aktif manapun.

2. **Dukungan Akses Dual-Port (Single-Port Production & Vite Dev Proxy)**:
   - **Mode Single-Port Production (`Port 3003`)**: Express backend menyajikan berkas frontend React (`dist/index.html`) dan API backend sekaligus dalam **1 Port Tunggal** untuk mensimulasikan lingkungan server NAS/Nginx.
   - **Mode Vite Dev Server (`Port 5175`)**: Vite Reverse Proxy meneruskan rute `/api` ke `http://127.0.0.1:3003`. Wajib menggunakan IPv4 `127.0.0.1` (bukan `localhost`) untuk menghindari bug resolusi IPv6 Node 18+ di Windows (`ECONNREFUSED ::1:3003`).

3. **Integrasi Kamera KTP & Google Gemini Vision AI**:
   - Analisis Kamera KTP pada `geminiVisionService.js` diproses langsung ke API Google Cloud (`https://generativelanguage.googleapis.com`) over HTTPS dengan SSL resmi.
   - Ketika dikombinasikan dengan Vite HTTPS (`basicSsl()`), semua rute `/api` tetap berjalan mulus melalui Vite Reverse Proxy tanpa memicu blokir *Mixed Content Security*.

---

## 🏛️ 11. Standar Pembuatan & Penggunaan Modal Reusable (`component/modal/`)

1. **Pemusatan Komponen Modal**:
   - Ketika membuat fitur **Hapus (Delete)**, **Edit (Update)**, atau **Tambah (Create)** data yang berbentuk *Modal Dialog* (bukan halaman rute terpisah), **WAJIB diletakkan di dalam direktori `frontend/src/component/modal/`** (contoh: `delete.jsx`, `userModal.jsx`, `kapalModal.jsx`).
2. **Prinsip Penggunaan Ulang (Reusability & DRY)**:
   - Sebelum merancang modal atau form baru, **selalu cari & periksa terlebih dahulu** komponen yang sudah tersedia di `component/modal/` dan `component/form/` (seperti `Label.jsx`, `InputField.jsx`, `TextArea.jsx`, `FileInput.jsx`, `CustomSelect.jsx`, `Combobox.jsx`, `Select.jsx`, serta `delete.jsx`).
   - Manfaatkan dan kombinasikan komponen-komponen tersebut agar kode tetap bersih, konsisten, dan mudah dipelihara.

---

## ⚡ 12. Aturan Eksekusi Build & Performa (`npm run build`)

1. **Efisiensi Waktu Pengembangan**:
   - **Hindari menjalankan perintah `npm run build` secara berlebihan** di setiap perubahan kecil kode frontend untuk menghemat waktu dan beban memori/CPU.
2. **Kondisi Penggunaan Build**:
   - Perintah `npm run build` **hanya dijalankan jika terjadi error / kendala kompilasi**, atau saat verifikasi akhir sebelum deployment produksi.
