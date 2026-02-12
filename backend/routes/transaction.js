const express = require("express");
const router = express.Router();
const {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
} = require("../middleware/transactionSchema");
const {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  deleteTransaction,
} = require("../controllers/transactionController");

// POST   /api/transactions
router.post("/", createTransactionSchema, createTransaction);

// GET    /api/transactions
router.get("/", getTransactionsSchema, getTransactions);

// GET    /api/transactions/summary
router.get("/summary", getTransactionSummary);

// DELETE /api/transactions/:id
router.delete("/:id", deleteTransactionSchema, deleteTransaction);

module.exports = router;
