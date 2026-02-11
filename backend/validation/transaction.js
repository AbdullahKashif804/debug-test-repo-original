// backend/validations/transaction.js
const yup = require("yup");

const transactionSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  type: yup.string().oneOf(["income", "expense"]).required("Type is required"),
});

module.exports = { transactionSchema };
