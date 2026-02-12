const express = require("express");
const cors = require("cors");
const txRoutes = require("./routes/transaction");

const app = express();

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());


app.use("/api/transactions", txRoutes);

app.use((req, res, next) => {           //404 error handler
  res.status(404).json({ error: "Not Found" });
});

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});


app.listen(4000, () => {
  console.log(`Server running `);
});
