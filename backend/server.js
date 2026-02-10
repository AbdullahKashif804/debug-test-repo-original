const express = require("express");
const app = express();
const txRoutes = require("./routes/transactions");

app.use(express.json());
app.use("/api/transactions", txRoutes);

// ❌ No global error handler
app.listen(4000, () => {
  console.log("Server running on 4000");
});
