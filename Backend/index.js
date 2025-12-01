const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();

// ---------------------
// Middleware
// ---------------------
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(bodyParser.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// SQLite DB
// ---------------------
const dbPath = path.join(__dirname, "store.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Failed to connect to DB:", err.message);
  else console.log("Connected to SQLite DB at", dbPath);
});

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

// ---------------------
// Multer setup
// ---------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// =====================================================
// PRODUCTS ROUTES
// =====================================================

// GET all products
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD new product (image URL or local file)
app.post("/api/products", upload.single("file"), (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  if (!name || !price) return res.status(400).json({ message: "Name & Price required" });

  // If a file is uploaded, use its path; otherwise use imageUrl
  let image = imageUrl || "";
  if (req.file) image = `/uploads/${req.file.filename}`;

  db.run(
    "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
    [name, price, image, description || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        name,
        price,
        image,
        description,
      });
    }
  );
});

// DELETE product (also remove local image if exists)
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  db.get("SELECT image FROM products WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Product not found" });

    if (row.image && row.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, row.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err.message);
      });
    }

    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product deleted", id });
    });
  });
});

// =====================================================
// ORDERS ROUTES
// =====================================================
app.get("/api/orders", (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/orders", (req, res) => {
  const { items, total } = req.body;

  if (!items || !total) return res.status(400).json({ message: "Items & Total required" });

  db.run(
    "INSERT INTO orders (items, total) VALUES (?, ?)",
    [JSON.stringify(items), total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, items, total, status: "Pending" });
    }
  );
});

app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.run("UPDATE orders SET status=? WHERE id=?", [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order updated", id, status });
  });
});

app.delete("/api/orders/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM orders WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted", id });
  });
});

// ======================================
// START SERVER
// ======================================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
