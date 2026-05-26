# Agent Context — Pesona Desa Wisata Nusantara
**Project:** II2210 Teknologi Platform  
**Tema:** Tourism & Culture Exchange  
**Platform:** Pesona Desa Wisata Nusantara

---

## 1. Ringkasan Proyek

Pesona Desa Wisata Nusantara adalah platform web untuk mempromosikan desa wisata tersembunyi di Indonesia. Fokus awal Tugas 1 adalah membangun fondasi infrastruktur dan melakukan deployment frontend awal secara publik. Untuk Tugas 2, platform dikembangkan menjadi sistem interaktif dengan autentikasi, role-based access, backend mandiri, database mandiri di VPS, serta minimal dua alur interaksi utama.

---

## 2. Hasil Tugas 1 yang Sudah Selesai

### 2.1 Infrastruktur dan Deployment
- VPS/VM berbasis Ubuntu 24.04 LTS sudah disiapkan.
- aaPanel sudah terpasang dan digunakan untuk manajemen website.
- Nginx sudah digunakan sebagai web server.
- Cloudflare Tunnel sudah digunakan agar website bisa diakses publik tanpa membuka port publik langsung.
- Panel aaPanel sudah diamankan dengan perubahan username/password, security entrance, port kustom, dan SSL panel dimatikan agar tidak bentrok dengan Cloudflare Tunnel.

### 2.2 Website Awal yang Sudah Online
Frontend awal sudah berhasil di-deploy sebagai landing page interaktif dengan:
- HTML, CSS, JavaScript
- galeri destinasi
- deskripsi budaya lokal
- integrasi OpenWeatherMap API
- integrasi Google Maps Embed

### 2.3 Techstack Tugas 1
- Virtualisasi: VMware Workstation
- OS: Ubuntu 24.04 LTS
- Panel: aaPanel
- Web server: Nginx
- Tunnel: Cloudflare Tunnel
- Frontend: HTML, CSS, JavaScript
- AI assistant: Gemini CLI
- API publik: OpenWeatherMap, Google Maps Embed

---

## 3. Kondisi Terbaru yang Sudah Dicapai Saat Memasuki Tugas 2

### 3.1 Backend Lokal
Backend sudah mulai dibuat secara lokal dengan:
- Node.js + Express
- `package.json`
- `server.js`
- `db.js`
- `.env`
- dependency:
  - `express`
  - `cors`
  - `dotenv`
  - `mysql2`
  - `bcrypt`
  - `jsonwebtoken`
  - `multer`
  - `nodemon`

### 3.2 Database Lokal
Database lokal sudah berhasil disiapkan di laptop development:
- MySQL/MariaDB lokal berhasil dijalankan
- database `pesonadesa` sudah dibuat
- tabel `users` sudah dibuat
- koneksi backend ke database sudah berhasil

### 3.3 Register API Sudah Berjalan
Register endpoint backend sudah berhasil:
- data user masuk ke database
- password disimpan dalam bentuk hash bcrypt
- role user tersimpan
- contoh data berhasil terlihat di tabel `users`

### 3.4 Status Sistem Login
Login system **belum final diimplementasikan**, tetapi desain yang disepakati adalah:
- register langsung menyimpan user ke database
- user bisa login setelah register
- backend mengembalikan JWT token
- frontend akan membaca role dari response login
- frontend melakukan redirect ke dashboard sesuai role

---

## 4. Arsitektur Final yang Diinginkan untuk Tugas 2

### 4.1 Frontend
Frontend dibuat dengan pendekatan sederhana agar cepat selesai:
- HTML
- CSS
- JavaScript
- Bootstrap CDN untuk styling cepat

### 4.2 Backend
Backend menggunakan:
- Node.js
- Express.js
- JWT
- bcrypt
- multer
- MySQL

### 4.3 Database
Database dikelola sendiri di VPS / MySQL lokal saat development.
Sesuai spesifikasi Tugas 2, database tidak boleh menggunakan Supabase/Firebase atau layanan database terkelola serupa.

### 4.4 Integrasi API Publik
API publik yang dipertahankan dari Tugas 1:
- OpenWeatherMap API
- Google Maps Embed

---

## 5. Role Sistem Platform

Platform harus memiliki minimal tiga role:
1. **Superadmin**
2. **Provider / Penyedia Wisata**
3. **Tourist / Wisatawan**

### 5.1 Aturan Role yang Disarankan
- **Tourist**: boleh register langsung dan login.
- **Provider**: boleh register langsung dan login.
- **Superadmin**: tidak boleh register bebas; dibuat manual di database untuk keamanan.

### 5.2 Pembatasan Akses
- Provider tidak boleh mengakses endpoint admin.
- Tourist tidak boleh mengakses endpoint provider.
- Backend harus memvalidasi role dengan middleware.
- Frontend hanya boleh melakukan redirect; keamanan utama tetap di backend.

---

## 6. Flow Sistem Login yang Disepakati

### 6.1 Register Flow
1. User mengisi form register.
2. Backend memvalidasi data.
3. Password di-hash dengan bcrypt.
4. Data disimpan ke tabel `users`.
5. Response berhasil dikirim ke frontend.

### 6.2 Login Flow
1. User mengisi email dan password.
2. Backend mencari user berdasarkan email.
3. Backend membandingkan password dengan bcrypt.
4. Jika valid, backend membuat JWT token.
5. Response berisi token dan role user dikirim ke frontend.
6. Frontend menyimpan token di localStorage/sessionStorage.
7. Frontend redirect ke dashboard sesuai role.

### 6.3 Redirect Berdasarkan Role
- `admin` → dashboard admin
- `provider` → dashboard provider
- `tourist` → dashboard wisatawan

---

## 7. Fitur Inti Tugas 2 yang Harus Dibangun

### 7.1 Authentication
- register
- login
- JWT
- role-based access

### 7.2 Manajemen Destinasi
- tambah destinasi
- edit destinasi
- hapus destinasi
- upload gambar destinasi
- tampilkan daftar destinasi

### 7.3 Booking / Interaksi Wisatawan
- wisatawan memilih destinasi
- wisatawan membuat booking / request
- booking tersimpan ke database
- provider / admin bisa melihat data booking

### 7.4 Review / Ulasan
- wisatawan memberi ulasan
- rating / komentar tersimpan
- ulasan ditampilkan di halaman destinasi

### 7.5 Keunikan Platform
Ide keunikan yang cocok:
- rekomendasi desa wisata berdasarkan cuaca
- informasi budaya lokal per destinasi
- tampilan galeri destinasi yang kaya konteks lokal

---

## 8. Minimal Dua Alur Interaksi untuk Laporan Tugas 2

Spesifikasi Tugas 2 mewajibkan minimal dua sequence diagram dan alur interaksi yang jelas antara produsen dan konsumen.

### 8.1 Alur Interaksi 1 — Provider Upload Destinasi
Aktor:
- Provider
- Platform
- Database
- Storage file

Alur:
1. Provider login.
2. Provider isi form destinasi.
3. Provider upload gambar.
4. Backend validasi role provider.
5. Data destinasi disimpan ke database.
6. Gambar disimpan ke storage lokal.
7. Destinasi tampil di frontend.

### 8.2 Alur Interaksi 2 — Tourist Booking Wisata
Aktor:
- Tourist
- Platform
- Database

Alur:
1. Tourist login.
2. Tourist memilih destinasi.
3. Tourist isi form booking.
4. Backend validasi data booking.
5. Booking disimpan ke database.
6. Status booking ditampilkan kembali ke user.

---

## 9. Minimal Flowchart Fungsional untuk Laporan

Flowchart yang disarankan untuk Tugas 2:
- Register user
- Login user
- Provider upload destinasi
- Tourist booking destinasi

Flowchart harus menunjukkan:
- input
- validasi
- proses backend
- output hasil
- penolakan jika invalid

---

## 10. Struktur Folder yang Disarankan

### 10.1 Root Project
```text
pesona-desa/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

### 10.2 Frontend
```text
frontend/
├── index.html
├── login.html
├── register.html
├── dashboard-admin.html
├── dashboard-provider.html
├── dashboard-tourist.html
├── destinations.html
├── booking.html
├── css/
├── js/
└── assets/
```

### 10.3 Backend
```text
backend/
├── server.js
├── db.js
├── .env
├── package.json
├── package-lock.json
├── routes/
├── controllers/
├── middleware/
├── uploads/
└── utils/
```

---

## 11. Database Schema Awal yang Disarankan

### 11.1 `users`
Kolom:
- id
- name
- email
- password
- role
- approved

### 11.2 `destinations`
Kolom:
- id
- title
- description
- culture
- location
- image
- provider_id

### 11.3 `bookings`
Kolom:
- id
- user_id
- destination_id
- status
- created_at

### 11.4 `reviews`
Kolom:
- id
- user_id
- destination_id
- rating
- comment

---

## 12. Prioritas Pengerjaan Saat Ini

### Prioritas 1
- login endpoint
- JWT token
- auth middleware
- role middleware

### Prioritas 2
- destinasi CRUD
- upload gambar
- booking endpoint

### Prioritas 3
- frontend login/register
- dashboard per role
- integrasi fetch API

### Prioritas 4
- deployment backend ke VPS
- cloudflare routing
- final public test
- screenshot bukti publik

---

## 13. Progress GitHub
Project sudah disiapkan untuk kerja kolaboratif via GitHub.
Tujuan GitHub:
- sinkronisasi antara 2 orang
- mencegah konflik file
- memudahkan pull/push
- memisahkan kerja frontend dan backend

Disarankan:
- `.gitignore` berisi `node_modules`, `.env`, dan `.DS_Store`
- repo tetap bersih
- file rahasia tidak ikut ter-push

---

## 14. Progress yang Harus Dianggap Sumber Kebenaran Saat Lanjut Chat

Kalau ada pertanyaan lanjutan, konteks yang harus dianggap benar adalah:

1. Proyek ini bernama **Pesona Desa Wisata Nusantara**.
2. Tugas 1 sudah selesai pada level infrastruktur dan landing page publik.
3. Tugas 2 sedang dibangun sebagai platform interaktif dengan backend, database, auth, dan role.
4. Backend lokal sudah dapat connect ke database lokal.
5. Register API sudah berhasil menyimpan user ke database dengan password bcrypt.
6. Login, JWT, role middleware, CRUD destinasi, booking, dan upload gambar adalah fitur lanjutan yang harus diselesaikan.
7. Admin sebaiknya dibuat manual, bukan registrasi bebas.
8. Tourist dan provider boleh register langsung.
9. Security utama harus ada di backend, bukan hanya di frontend.
10. Frontend bisa sederhana dulu dengan HTML/CSS/JS + Bootstrap.

---

## 15. Catatan Penting Untuk Laporan Tugas 2

Laporan Tugas 2 harus memuat:
- kontrol akses dan role
- database dan backend mandiri
- minimal dua sequence diagram
- system flowchart
- rasionalisasi fungsi
- keunikan platform
- pustaka arsitektur
- link platform publik
- screenshot platform publik

Spesifikasi ini tertulis di dokumen Tugas 2. fileciteturn2file0L145-L160

---

## 16. Cara Menggunakan Context Ini

Saat melanjutkan pekerjaan:
- tetap gunakan struktur role di atas
- jangan ubah konsep utama platform
- jangan pakai database eksternal terkelola
- prioritaskan fitur inti dulu
- dokumentasi bisa ditulis setelah flow sistem stabil
- jika waktu mepet, utamakan auth + CRUD destinasi + booking + deployment

---

## 17. Status Ringkas Saat Ini

### Sudah selesai:
- infrastruktur Tugas 1
- landing page publik
- database lokal
- backend Express dasar
- register ke DB
- bcrypt hashing
- GitHub repo awal

### Sedang dikerjakan:
- login JWT
- role middleware
- final struktur frontend
- integrasi endpoint ke frontend

### Belum selesai:
- CRUD destinasi
- booking
- review
- dashboard role
- sequence diagram final
- flowchart final
- laporan Tugas 2
