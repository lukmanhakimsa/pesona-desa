const express = require("express");
const db = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const ALLOWED_STATUS = ["pending", "confirmed", "cancelled", "completed"];

router.post("/", authenticateToken, authorizeRoles("tourist"), async (req, res) => {
  const { destination_id, visit_date, guest_count, notes } = req.body;

  try {
    if (!destination_id || !visit_date) {
      return res.status(400).json({ message: "destination_id dan visit_date wajib diisi" });
    }

    const [destinations] = await db.query("SELECT id FROM destinations WHERE id = ?", [
      destination_id
    ]);

    if (destinations.length === 0) {
      return res.status(404).json({ message: "Destinasi tidak ditemukan" });
    }

    const [result] = await db.query(
      `
      INSERT INTO bookings (user_id, destination_id, visit_date, guest_count, notes, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
      `,
      [req.user.id, destination_id, visit_date, guest_count || 1, notes || null]
    );

    res.status(201).json({
      message: "Booking berhasil dibuat",
      booking: {
        id: result.insertId,
        user_id: req.user.id,
        destination_id,
        visit_date,
        guest_count: guest_count || 1,
        notes: notes || null,
        status: "pending"
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat booking" });
  }
});

router.get("/mine", authenticateToken, authorizeRoles("tourist"), async (req, res) => {
  try {
    const [bookings] = await db.query(
      `
      SELECT b.*, d.title AS destination_title, d.location
      FROM bookings b
      JOIN destinations d ON d.id = b.destination_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [req.user.id]
    );

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil booking wisatawan" });
  }
});

router.get(
  "/provider",
  authenticateToken,
  authorizeRoles("provider"),
  async (req, res) => {
    try {
      const [bookings] = await db.query(
        `
        SELECT
          b.*,
          d.title AS destination_title,
          u.name AS tourist_name,
          u.email AS tourist_email
        FROM bookings b
        JOIN destinations d ON d.id = b.destination_id
        JOIN users u ON u.id = b.user_id
        WHERE d.provider_id = ?
        ORDER BY b.created_at DESC
        `,
        [req.user.id]
      );

      res.json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal mengambil booking provider" });
    }
  }
);

router.get("/", authenticateToken, authorizeRoles("superadmin"), async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT
        b.*,
        d.title AS destination_title,
        provider.name AS provider_name,
        tourist.name AS tourist_name,
        tourist.email AS tourist_email
      FROM bookings b
      JOIN destinations d ON d.id = b.destination_id
      JOIN users provider ON provider.id = d.provider_id
      JOIN users tourist ON tourist.id = b.user_id
      ORDER BY b.created_at DESC
    `);

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil semua booking" });
  }
});

router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("provider", "superadmin"),
  async (req, res) => {
    const { status } = req.body;

    try {
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Status booking tidak valid" });
      }

      const [bookings] = await db.query(
        `
        SELECT b.*, d.provider_id
        FROM bookings b
        JOIN destinations d ON d.id = b.destination_id
        WHERE b.id = ?
        `,
        [req.params.id]
      );

      if (bookings.length === 0) {
        return res.status(404).json({ message: "Booking tidak ditemukan" });
      }

      if (req.user.role === "provider" && Number(bookings[0].provider_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: "Provider hanya boleh mengubah booking destinasi sendiri" });
      }

      await db.query("UPDATE bookings SET status = ? WHERE id = ?", [
        status,
        req.params.id
      ]);

      res.json({ message: "Status booking berhasil diperbarui" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal memperbarui status booking" });
    }
  }
);

module.exports = router;
