const express = require("express");
const db = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("superadmin"));

router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT id, name, email, role, approved, created_at
      FROM users
      ORDER BY created_at DESC, id DESC
      `
    );

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
});

router.get("/pending-providers", async (req, res) => {
  try {
    const [providers] = await db.query(
      `
      SELECT id, name, email, role, approved, created_at
      FROM users
      WHERE role = 'provider' AND approved = FALSE
      ORDER BY created_at ASC, id ASC
      `
    );

    res.json({ providers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil provider pending" });
  }
});

router.patch("/approve/:id", async (req, res) => {
  try {
    const [providers] = await db.query(
      "SELECT id, name, email, approved FROM users WHERE id = ? AND role = 'provider'",
      [req.params.id]
    );

    if (providers.length === 0) {
      return res.status(404).json({ message: "Provider tidak ditemukan" });
    }

    if (providers[0].approved) {
      return res.json({
        message: "Provider sudah diapprove",
        provider: providers[0]
      });
    }

    await db.query("UPDATE users SET approved = TRUE WHERE id = ?", [req.params.id]);

    res.json({
      message: "Provider berhasil diapprove",
      provider: {
        ...providers[0],
        approved: true
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal approve provider" });
  }
});

module.exports = router;
