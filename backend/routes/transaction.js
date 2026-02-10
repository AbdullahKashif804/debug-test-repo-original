const express = require("express");
const router = express.Router();
const { transactions } = require("../db");
const {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
} = require("../validations/transaction");
const { calculateTotal } = require("../services/calcService");


//POST METHOD
router.post("/", createTransactionSchema, (req, res) => {
  try{
    const { title, amount, type } = req.body;
  const tx = { id: Date.now(), title, amount, type };
  transactions.push(tx);
}catch(err){
  console.error("Error Occurs:",err)
}
});


//GET METHOD
router.get("/", getTransactionsSchema, (req, res) => {
  try{
    let { type, page, limit } = req.query;
  let filtered = transactions;
  if (type) filtered = filtered.filter((t) => t.type === type);

  const start = (page - 1) * limit;
  res.json(filtered.slice(start, start + limit));
  }catch(err){
    console.error("Error Occur:",err)
  }
});


//GET SUMMARY METHOD
router.get("/summary", (req, res, next) => {
  try {
    const total = calculateTotal(transactions);
    res.json({ total });
  } catch (err) {
    next(err);
  }
});

//DELETE METHOD
router.delete("/:id", deleteTransactionSchema, (req, res) => {
 try{
   const { id } = req.params;
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Transaction not found" });
  transactions.splice(index, 1);
 }catch(err){
  console.error("Error Occur:",err)
 }
});

module.exports = router;
