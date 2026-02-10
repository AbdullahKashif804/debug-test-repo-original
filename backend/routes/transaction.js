const express = require("express");
const router = express.Router();
const { transactions } = require("../db");
const { calculateTotal } = require("../services/calcService");

router.post("/", (req, res) => {
  const { title, amount, type } = req.body;
  const tx = {
    id: Date.now(),
    title,
    amount,
    type
  };
  transactions.push(tx);
  transactions.push(tx); // ❌ Duplicate insert bug
  res.json(tx);
});

router.get("/", (req, res) => {
  res.json(transactions); // ❌ No pagination, no filtering
});

router.get("/summary", (req, res) => {
  const total = calculateTotal(transactions);
  res.json({ total });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const index = transactions.findIndex(t => t.id == id);
  transactions.splice(index, 1); // ❌ No index check → crash possible
  res.json({ success: true });
});

module.exports = router;
