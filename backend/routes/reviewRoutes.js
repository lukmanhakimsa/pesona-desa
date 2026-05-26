const express = require("express");
const db = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/destination/:destinationId", async (req, res) => {
  try {
    const [reviews] = await db.query(
      `
      SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.destination_id = ?
      ORDER BY r.created_at DESC
      `,
      [req.params.destinationId]
    );

    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil review" });
  }
});

router.post("/", authenticateToken, authorizeRoles("tourist"), async (req, res) => {
  const { destination_id, rating, comment } = req.body;
  const numericRating = Number(rating);

  try {
    if (!destination_id || !numericRating || !comment) {
      return res.status(400).json({ message: "destination_id, rating, dan comment wajib diisi" });
    }

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating harus bernilai 1 sampai 5" });
    }

    const [destinations] = await db.query("SELECT id FROM destinations WHERE id = ?", [
      destination_id
    ]);

    if (destinations.length === 0) {
      return res.status(404).json({ message: "Destinasi tidak ditemukan" });
    }

    const [result] = await db.query(
      `
      INSERT INTO reviews (user_id, destination_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
      `,
      [req.user.id, destination_id, numericRating, comment]
    );

    res.status(201).json({
      message: "Review berhasil disimpan",
      review: {
        id: result.insertId,
        user_id: req.user.id,
        destination_id,
        rating: numericRating,
        comment
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menyimpan review" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const [reviews] = await db.query("SELECT * FROM reviews WHERE id = ?", [
      req.params.id
    ]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    const ownsReview = reviews[0].user_id === req.user.id;
    if (!ownsReview && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Tidak boleh menghapus review ini" });
    }

    await db.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);

    res.json({ message: "Review berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus review" });
  }
});

module.exports = router;
