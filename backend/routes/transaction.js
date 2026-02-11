const express = require("express");
const router = express.Router();
const { transactions } = require("../db");
const {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
} = require("../MiddleWare/TransactionSchema");
const { calculateTotal } = require("../services/calcService");

// GET SUMMARY METHOD - Must be before /:id route
router.get("/summary", (req, res) => {
  try {
    const summary = calculateTotal(transactions);
    return res.status(200).json({ 
      success: true,
      summary
    });
  } catch (err) {
    console.error("Error calculating summary:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error calculating summary" 
    });
  }
});

// POST METHOD - Create new transaction
router.post("/", createTransactionSchema, (req, res) => {
  try {
    const { title, amount, type, date } = req.body;
    const tx = { 
      id: Date.now(), 
      title, 
      amount: parseFloat(amount), 
      type,
      date: date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };
    transactions.push(tx);
    return res.status(201).json({ 
      success: true, 
      transaction: tx, 
      message: "Transaction added successfully!" 
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
});

// GET METHOD - Fetch all transactions with optional filtering
router.get("/", getTransactionsSchema, (req, res) => {
  try {
    let { type, page = 1, limit = 10 } = req.query;
    let filtered = transactions;
    
    // Filter by type if provided
    if (type) {
      filtered = filtered.filter((t) => t.type === type);
    }

    // Apply pagination
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResults = filtered.slice(start, start + parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: paginatedResults,
      total: filtered.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Error fetching transactions" 
    });
  }
});

// DELETE METHOD - Remove transaction by ID
router.delete("/:id", deleteTransactionSchema, (req, res) => {
  try {
    const { id } = req.params;
    const index = transactions.findIndex((t) => t.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Transaction not found" 
      });
    }
    
    const deletedTransaction = transactions.splice(index, 1)[0];
    return res.status(200).json({ 
      success: true, 
      message: "Transaction deleted successfully", 
      transaction: deletedTransaction 
    });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
});

module.exports = router;
