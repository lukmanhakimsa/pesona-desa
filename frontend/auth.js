// =============================================
// auth.js - Utility bersama untuk semua halaman
// =============================================

// Legacy cleanup: versi lokal sebelumnya pernah membaca localStorage.apiOrigin
// sehingga browser bisa tetap mencoba http://localhost:3010 dari cache lama.
localStorage.removeItem("apiOrigin");

const API_ORIGIN = "";
const API_BASE = `${API_ORIGIN}/api`;

function assetUrl(path) {
  return path ? `${API_ORIGIN}${path}` : "";
}

// Ambil token dari localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Ambil data user dari localStorage (sudah berbentuk object)
function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// Logout: hapus data & redirect ke login
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Cek apakah user sudah login dan punya role yang diizinkan.
// allowedRoles bisa array, misal ['provider'] atau ['superadmin']
// Kalau tidak sesuai, langsung redirect.
function requireAuth(allowedRoles = []) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    window.location.href = "login.html";
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    alert("Akses ditolak! Kamu tidak punya izin ke halaman ini.");
    logout();
    return null;
  }

  return user;
}

// Wrapper fetch yang otomatis pasang Authorization header
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  // Kalau body-nya FormData, jangan set Content-Type (biar browser auto-set boundary)
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

// Tampilkan toast notifikasi sederhana
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `alert alert-${type === "success" ? "success" : "danger"} alert-dismissible fade show shadow-sm`;
  toast.style.cssText = "min-width:280px; margin-bottom:8px;";
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.appendChild(toast);

  // Auto hilang setelah 4 detik
  setTimeout(() => toast.remove(), 4000);
}
