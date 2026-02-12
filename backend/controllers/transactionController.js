const db = require("../database/db");
const { calculateTotal } = require("../services/calcService");

// POST /api/transactions
const createTransaction = (req, res, next) => {
    try {
        const { title, amount, type, date } = req.body;
        const tx = { id: Date.now(), title, amount, type, date };
        db.transactions.push(tx);
        res.status(201).json(tx);
    } catch (err) {
        next(err);
    }
};

// GET /api/transactions
const getTransactions = (req, res, next) => {
    try {
        let { type, page, limit } = req.query;

        let filtered = db.transactions;
        if (type) {
            filtered = filtered.filter((t) => t.type === type);
        }

        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        res.json({
            data: paginated,
            total: filtered.length,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/transactions/summary
const getTransactionSummary = (req, res, next) => {
    try {
        const total = calculateTotal(db.transactions);
        res.json({ total });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/transactions/:id
const deleteTransaction = (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const index = db.transactions.findIndex((t) => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const [deleted] = db.transactions.splice(index, 1);
        res.json({ message: "Transaction deleted", data: deleted });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionSummary,
    deleteTransaction,
};
