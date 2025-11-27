const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Connect to SQLite
const db = new sqlite3.Database("./store.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
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

// --- Products API ---

// Get all products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add new product (file or URL)
app.post("/products", upload.single("file"), (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name & Price required" });

  let image = "";
  if (req.file) {
    image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    image = imageUrl;
  }

  db.run(
    "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
    [name, price, image, description || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // Return the inserted product as JSON
      res.json({ id: this.lastID, name, price, image, description });
    }
  );
});

// Delete product
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully", id });
  });
});

// --- Orders API ---

// Get all orders
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create new order
app.post("/orders", (req, res) => {
  const { items, total } = req.body;
  if (!items || !total) return res.status(400).json({ message: "Items & total required" });

  db.run(
    "INSERT INTO orders (items, total) VALUES (?, ?)",
    [JSON.stringify(items), total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, items, total, status: "Pending" });
    }
  );
});

// Update order status
app.put("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status required" });

  db.run(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: "Order not found" });
      res.json({ message: "Order updated", id, status });
    }
  );
});

// Delete order
app.delete("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

  db.run("DELETE FROM orders WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully", id });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
