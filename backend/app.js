import express from "express";
import cors from "cors";
import transactionRoutes from "./routes/transaction.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
