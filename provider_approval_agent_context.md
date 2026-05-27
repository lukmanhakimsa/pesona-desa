# AGENT CONTEXT — FITUR APPROVAL PROVIDER (PESONA DESA)

## PROJECT
Pesona Desa Wisata Nusantara

Tema:
Tourism & Culture Exchange

Stack:
- Frontend: HTML, CSS, Bootstrap, Vanilla JS
- Backend: Node.js + Express
- Database: MySQL
- Deployment: Ubuntu VPS + aaPanel + Nginx + Cloudflare

---

# TUJUAN UPDATE FITUR

Menambahkan sistem approval provider oleh superadmin agar sesuai dengan spesifikasi tugas II2210 Teknologi Platform.

Requirement tugas:
- Registrasi pengguna harus diterima oleh superadmin terlebih dahulu.
- Platform memiliki role:
  - superadmin
  - provider (penyedia jasa)
  - tourist (konsumen/turis)

IMPLEMENTASI FINAL YANG DIPILIH:
- Tourist → langsung aktif setelah register.
- Provider → harus diapprove superadmin.
- Superadmin → dibuat manual via database.

---

# FLOW SISTEM FINAL

## TOURIST FLOW

Register
→ approved otomatis = true
→ bisa login langsung
→ akses dashboard tourist

---

## PROVIDER FLOW

Register
→ approved = false
→ tidak bisa login
→ muncul status:
"Akun provider menunggu approval admin"

↓

Superadmin approve akun

↓

approved = true

↓

Provider bisa login dan akses dashboard provider

---

# ROLE SYSTEM

## SUPERADMIN
Hak akses:
- melihat seluruh user
- approve provider
- manage destinasi
- manage platform

Tidak bisa register dari frontend.

Dibuat manual di database.

---

## PROVIDER
Hak akses:
- upload destinasi
- edit destinasi milik sendiri
- upload gambar wisata

Harus approved dahulu.

---

## TOURIST
Hak akses:
- melihat destinasi
- booking wisata
- review wisata

Tidak perlu approval.

---

# DATABASE UPDATE

## TABEL USERS

Pastikan terdapat field:

```sql
approved BOOLEAN DEFAULT FALSE
```

---

# BACKEND UPDATE

## FILE TERKAIT

Backend:
- routes/authRoutes.js
- middleware/authMiddleware.js
- middleware/roleMiddleware.js
- routes/adminRoutes.js

---

# LOGIN VALIDATION

Saat login provider:

```js
if (user.role === "provider" && user.approved === 0)
```

return:

```json
{
  "message": "Akun provider menunggu approval admin"
}
```

---

# ADMIN FEATURE

## ENDPOINT BARU

```http
GET /api/admin/pending-providers
PATCH /api/admin/approve/:id
```

---

# FRONTEND UPDATE

## PENTING

SEMUA UI BARU HARUS:
- mengikuti style existing frontend,
- menggunakan warna/theme yang sama,
- menggunakan Bootstrap existing,
- menjaga konsistensi navbar/card/dashboard.

JANGAN redesign total UI.

---

# FRONTEND FILES YANG MUNGKIN DIUBAH

Frontend:
- register.html
- login.html
- dashboard-admin.html
- admin.js
- auth.js
- style.css

---

# PRIORITAS IMPLEMENTASI

1. backend approval logic
2. login validation
3. admin endpoints
4. admin frontend UI
5. testing fullstack
6. deployment update

---

# FINAL TARGET

Platform final harus memiliki:
- authentication
- role-based access
- provider approval system
- JWT authorization
- MySQL database
- public deployment
- frontend dashboard
- provider-tourist interaction
