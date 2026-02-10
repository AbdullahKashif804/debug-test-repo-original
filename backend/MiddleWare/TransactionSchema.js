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
  });

  try {
    req.body = await schema.validate(req.body, {
    });
    next();
  } catch (err) {
    res.status(400).send(`Error Occur: ${err.message}`);
  }
};

//GET Validation
const getTransactionsSchema = async (req, res, next) => {
  const schema = yup.object({
    type: yup.string().oneOf(["income", "expense"]).notRequired(),
    page: yup.number().positive().integer().default(1),
    limit: yup.number().positive().integer().default(10),
  });

  try {
    req.query = await schema.validate(req.query, { 
    });
    next();
  } catch (err) {
    res.status(400).send(`Error Occur: ${err.message}`);
  }
};

// DELETE Validation
const deleteTransactionSchema = async (req, res, next) => {
  const schema = yup.object({
    id: yup.number().positive().integer().required("Transaction ID is required"),
  });

  try {
    req.params = await schema.validate(req.params, {
    });
    next();
  } catch (err) {
    res.status(400).send(`Error Occur: ${err.message}`);
  }
};

module.exports = {
  createTransactionSchema,
  getTransactionsSchema,
  deleteTransactionSchema,
};
