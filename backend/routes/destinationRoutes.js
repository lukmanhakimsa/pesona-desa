const express = require("express");
const db = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [destinations] = await db.query(`
      SELECT
        d.id,
        d.title,
        d.description,
        d.culture,
        d.location,
        d.image,
        d.provider_id,
        d.created_at,
        u.name AS provider_name,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT r.id) AS review_count
      FROM destinations d
      LEFT JOIN users u ON u.id = d.provider_id
      LEFT JOIN reviews r ON r.destination_id = d.id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `);

    res.json({ destinations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar destinasi" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [destinations] = await db.query(
      `
      SELECT
        d.*,
        u.name AS provider_name,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT r.id) AS review_count
      FROM destinations d
      LEFT JOIN users u ON u.id = d.provider_id
      LEFT JOIN reviews r ON r.destination_id = d.id
      WHERE d.id = ?
      GROUP BY d.id
      `,
      [req.params.id]
    );

    if (destinations.length === 0) {
      return res.status(404).json({ message: "Destinasi tidak ditemukan" });
    }

    const [reviews] = await db.query(
      `
      SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.destination_id = ?
      ORDER BY r.created_at DESC
      `,
      [req.params.id]
    );

    res.json({ destination: destinations[0], reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail destinasi" });
  }
});

router.post(
  "/",
  authenticateToken,
  authorizeRoles("provider", "superadmin"),
  upload.single("image"),
  async (req, res) => {
    const { title, description, culture, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      if (!title || !description || !location) {
        return res.status(400).json({
          message: "Title, description, dan location wajib diisi"
        });
      }

      const providerId = Number(req.user.role === "provider" ? req.user.id : req.body.provider_id || req.user.id);

      const [result] = await db.query(
        `
        INSERT INTO destinations (title, description, culture, location, image, provider_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [title, description, culture || null, location, image, providerId]
      );

      res.status(201).json({
        message: "Destinasi berhasil dibuat",
        destination: {
          id: result.insertId,
          title,
          description,
          culture: culture || null,
          location,
          image,
          provider_id: providerId
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal membuat destinasi" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("provider", "superadmin"),
  upload.single("image"),
  async (req, res) => {
    const { title, description, culture, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
      const [destinations] = await db.query(
        "SELECT * FROM destinations WHERE id = ?",
        [req.params.id]
      );

      if (destinations.length === 0) {
        return res.status(404).json({ message: "Destinasi tidak ditemukan" });
      }

      const destination = destinations[0];
      if (req.user.role === "provider" && Number(destination.provider_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: "Provider hanya boleh mengubah destinasi sendiri" });
      }

      await db.query(
        `
        UPDATE destinations
        SET
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          culture = COALESCE(?, culture),
          location = COALESCE(?, location),
          image = COALESCE(?, image)
        WHERE id = ?
        `,
        [
          title || null,
          description || null,
          culture || null,
          location || null,
          image || null,
          req.params.id
        ]
      );

      res.json({ message: "Destinasi berhasil diperbarui" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal memperbarui destinasi" });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("provider", "superadmin"),
  async (req, res) => {
    try {
      const [destinations] = await db.query(
        "SELECT * FROM destinations WHERE id = ?",
        [req.params.id]
      );

      if (destinations.length === 0) {
        return res.status(404).json({ message: "Destinasi tidak ditemukan" });
      }

      if (req.user.role === "provider" && Number(destinations[0].provider_id) !== Number(req.user.id)) {
        return res.status(403).json({ message: "Provider hanya boleh menghapus destinasi sendiri" });
      }

      await db.query("DELETE FROM destinations WHERE id = ?", [req.params.id]);

      res.json({ message: "Destinasi berhasil dihapus" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal menghapus destinasi" });
    }
  }
);

module.exports = router;
