import * as service from "../services/transaction.service.js";

export const createTransaction = (req, res) => {
  const tx = service.createTransaction(req.body);
  res.status(201).json({ success: true, data: tx });
};

export const getTransactions = (req, res) => {
  const result = service.getTransactions(req.query);
  res.json({ success: true, ...result });
};

export const deleteTransaction = (req, res) => {
  const deleted = service.deleteTransaction(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  res.json({ success: true, message: "Deleted" });
};

export const getSummary = (req, res) => {
  const summary = service.getSummary();
  res.json({ success: true, data: summary });
};
