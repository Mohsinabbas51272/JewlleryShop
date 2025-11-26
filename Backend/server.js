const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite
const db = new sqlite3.Database("./store.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// Create tables if not exists
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

// Add new product (admin)
app.post("/products", (req, res) => {
  const { name, price, image, description } = req.body;
  db.run(
    "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
    [name, price, image, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, price, image, description });
    }
  );
});

// Delete a product (admin)
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
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
app.put("/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
