const yup = require("yup");

// Schema for creating a transaction (POST body)
const createTransactionModel = yup.object({
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
        .required("Date is required"),
});

// Schema for GET query params (filtering + pagination)
const getTransactionsModel = yup.object({
    type: yup.string().oneOf(["income", "expense"]).notRequired(),
    page: yup.number().positive().integer().default(1),
    limit: yup.number().positive().integer().default(10),
});

// Schema for DELETE param
const deleteTransactionModel = yup.object({
    id: yup
        .number()
        .positive()
        .integer()
        .required("Transaction ID is required"),
});

module.exports = {
    createTransactionModel,
    getTransactionsModel,
    deleteTransactionModel,
};
