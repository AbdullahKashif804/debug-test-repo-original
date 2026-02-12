const {
  createTransactionModel,
  getTransactionsModel,
  deleteTransactionModel,
} = require("../models/transactionModel");

// Helper — runs a Yup schema against a request property (body, query, params)
const validate = (schema, property) => async (req, res, next) => {
  try {
    req[property] = await schema.validate(req[property], { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner
      ? err.inner.map((e) => ({ field: e.path, message: e.message }))
      : [{ message: err.message }];
    res.status(400).json({ error: "Validation failed", errors });
  }
};

// Middleware exports
const createTransactionSchema = validate(createTransactionModel, "body");
const getTransactionsSchema = validate(getTransactionsModel, "query");
const deleteTransactionSchema = validate(deleteTransactionModel, "params");

module.exports = {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
};
