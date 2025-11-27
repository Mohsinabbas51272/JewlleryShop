const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads folder
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// SQLite DB
const db = new sqlite3.Database("./store.db");

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      image TEXT,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      items TEXT,
      total REAL,
      status TEXT DEFAULT 'Pending'
    )
  `);
});

// ===============================
// 🚀 ALL ROUTES MUST START WITH /api
// ===============================

// GET products
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD product
app.post("/api/products", upload.single("file"), (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  if (!name || !price)
    return res.status(400).json({ message: "Name & Price required" });

  let image = "";
  if (req.file) {
    image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    image = imageUrl;
  }

  db.run(
    "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
    [name, price, image, description || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID, name, price, image, description });
    }
  );
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted", id });
  });
});

// ===============================
// ORDERS
// ===============================

// GET orders
app.get("/api/orders", (req, res) => {
  db.all("SELECT * OF orders", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD order
app.post("/api/orders", (req, res) => {
  const { items, total } = req.body;

  db.run(
    "INSERT INTO orders (items, total) VALUES (?, ?)",
    [JSON.stringify(items), total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID, items, total, status: "Pending" });
    }
  );
});

// UPDATE order
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.run(
    "UPDATE orders SET status=? WHERE id=?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Order updated", id, status });
    }
  );
});

// DELETE order
app.delete("/api/orders/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM orders WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted", id });
  });
});



module.exports = app;
