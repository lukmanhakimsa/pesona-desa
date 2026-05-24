require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend jalan");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});