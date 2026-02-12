import crypto from "crypto";
import { transactions } from "../data/db.js";

export const createTransaction = (data) => {
  const tx = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date(),
  };

  transactions.push(tx);
  return tx;
};

export const getTransactions = ({ type, page, limit }) => {
  let filtered = type
    ? transactions.filter((t) => t.type === type)
    : transactions;

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    transactions: paginated,
    total: filtered.length,
  };
};

export const deleteTransaction = (id) => {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;
  return transactions.splice(index, 1)[0];
};

export const getSummary = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
};
