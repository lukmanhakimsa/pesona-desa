# Pesona Desa

Project wisata desa berbasis web.

## Tech Stack
- HTML
- CSS
- JavaScript
- Node.js
- Express
- MySQL

## Features
- Register
- Login
- Role system
- Wisata management

## Backend Status

Backend Tugas 2 sudah mencakup:
- Auth register/login dengan bcrypt dan JWT
- Role access untuk `superadmin`, `provider`, dan `tourist`
- CRUD destinasi untuk provider/superadmin
- Upload gambar destinasi ke `backend/uploads`
- Booking wisata oleh tourist
- Review/rating destinasi oleh tourist
- Schema dan migration MySQL di `backend/database`

Jalankan schema awal pada database kosong:

```bash
mysql -u pesona -p < backend/database/schema.sql
```

Jika tabel `users` sudah pernah dibuat sebelumnya, jalankan migration:

```bash
mysql -u pesona -p < backend/database/migrate_existing.sql
```

Buat superadmin manual:

```bash
cd backend
ADMIN_EMAIL=admin@pesonadesa.local ADMIN_PASSWORD=password-kuat npm run create:superadmin
```

Endpoint utama:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/destinations`
- `POST /api/destinations`
- `POST /api/bookings`
- `GET /api/bookings/mine`
- `GET /api/bookings/provider`
- `POST /api/reviews`
