import * as yup from "yup";

export const createTransactionValidation = yup.object({
  title: yup.string().trim().required(),
  amount: yup.number().positive().required(),
  type: yup.string().oneOf(["income", "expense"]).required(),
  date: yup.date().optional(),
});

export const getTransactionValidation = yup.object({
  type: yup.string().oneOf(["income", "expense"]).optional(),
  page: yup.number().positive().integer().default(1),
  limit: yup.number().positive().integer().max(100).default(10),
});

export const deleteTransactionValidation = yup.object({
  id: yup.string().required(),
});
