const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const PUBLIC_ROLES = ["tourist", "provider"];

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (!PUBLIC_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Role register hanya boleh tourist atau provider"
      });
    }

    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [
      email
    ]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const approved = role === "tourist";
    const sql =
      "INSERT INTO users (name, email, password, role, approved) VALUES (?, ?, ?, ?, ?)";

    const [result] = await db.query(sql, [name, email, hashedPassword, role, approved]);

    res.status(201).json({
      message: role === "provider"
        ? "Registrasi provider berhasil. Akun provider menunggu approval admin"
        : "User registered",
      user: {
        id: result.insertId,
        name,
        email,
        role,
        approved
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal register user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = users[0];
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    if (user.role === "provider" && !user.approved) {
      return res.status(403).json({
        message: "Akun provider menunggu approval admin"
      });
    }

    if (!user.approved) {
      return res.status(403).json({ message: "Akun belum disetujui admin" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal login" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  const [users] = await db.query(
    "SELECT id, name, email, role, approved, created_at FROM users WHERE id = ?",
    [req.user.id]
  );

  if (users.length === 0) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  res.json({ user: users[0] });
});

module.exports = router;
