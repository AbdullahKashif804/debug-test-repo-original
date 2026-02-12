// In-memory database store
// Using a module-level object so all consumers share the same reference
const db = {
    transactions: [],
};

module.exports = db;