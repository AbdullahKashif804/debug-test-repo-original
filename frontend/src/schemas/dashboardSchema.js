import * as yup from "yup";

export const Dashboardschema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters")
    .required("Title is required"),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed 1,000,000")
    .required("Amount is required"),

  type: yup
    .string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Transaction type is required"),

  date: yup
    .date()
    .typeError("Date must be a valid date")
    .test(
        "not-future",
        "Date cannot be in the future",
        (value) => !value || value <= new Date()
    )
    .required("Transaction date is required"),
});
