const yup = require("yup");

// POST /api/transactions — validate request body
const createTransactionSchema = async (req, res, next) => {
  const schema = yup.object({
    title: yup.string().trim().required("Title is required"),
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .required("Amount is required"),
    type: yup
      .string()
      .oneOf(["income", "expense"], "Type must be income or expense")
      .required("Type is required"),
  });

  try {
    req.body = await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner
      ? err.inner.map((e) => ({ field: e.path, message: e.message }))
      : [{ message: err.message }];
    res.status(400).json({ error: "Validation failed", errors });
  }
};

// GET /api/transactions — validate query params
const getTransactionsSchema = async (req, res, next) => {
  const schema = yup.object({
    type: yup.string().oneOf(["income", "expense"]).notRequired(),
    page: yup.number().positive().integer().default(1),
    limit: yup.number().positive().integer().default(10),
  });

  try {
    req.query = await schema.validate(req.query, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner
      ? err.inner.map((e) => ({ field: e.path, message: e.message }))
      : [{ message: err.message }];
    res.status(400).json({ error: "Validation failed", errors });
  }
};

// DELETE /api/transactions/:id — validate param
const deleteTransactionSchema = async (req, res, next) => {
  const schema = yup.object({
    id: yup
      .number()
      .positive()
      .integer()
      .required("Transaction ID is required"),
  });

  try {
    req.params = await schema.validate(req.params, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.inner
      ? err.inner.map((e) => ({ field: e.path, message: e.message }))
      : [{ message: err.message }];
    res.status(400).json({ error: "Validation failed", errors });
  }
};

module.exports = {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
};
