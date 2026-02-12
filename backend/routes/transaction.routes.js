import express from "express";
import * as controller from "../controllers/transaction.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTransactionValidation,
  getTransactionValidation,
  deleteTransactionValidation,
} from "../validations/transaction.validation.js";

const router = express.Router();

router.get("/summary", controller.getSummary);

router.post(
  "/",
  validate(createTransactionValidation, "body"),
  controller.createTransaction
);

router.get(
  "/",
  validate(getTransactionValidation, "query"),
  controller.getTransactions
);

router.delete(
  "/:id",
  validate(deleteTransactionValidation, "params"),
  controller.deleteTransaction
);

export default router;
