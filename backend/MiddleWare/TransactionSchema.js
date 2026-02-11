const yup = require("yup");

//POST Validation
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
    date: yup
      .date()
      .typeError("Date must be a valid date")
      .max(new Date(), "Date cannot be in the future")
      .notRequired(),
  });

  try {
    req.body = await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: "Validation failed", 
      errors: err.errors 
    });
  }
};

//GET Validation
const getTransactionsSchema = async (req, res, next) => {
  const schema = yup.object({
    type: yup.string().oneOf(["income", "expense"]).notRequired(),
    page: yup.number().positive().integer().default(1),
    limit: yup.number().positive().integer().max(100).default(10),
  });

  try {
    req.query = await schema.validate(req.query, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid query parameters", 
      errors: err.errors 
    });
  }
};

// DELETE Validation
const deleteTransactionSchema = async (req, res, next) => {
  const schema = yup.object({
    id: yup.number().positive().integer().required("Transaction ID is required"),
  });

  try {
    req.params = await schema.validate(req.params, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid transaction ID", 
      errors: err.errors 
    });
  }
};

module.exports = {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
};
