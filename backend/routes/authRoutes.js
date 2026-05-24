const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(
      sql,
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }

        res.json({
          message: "User registered"
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;