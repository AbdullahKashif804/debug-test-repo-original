import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction } from "../api";
import { Dashboardschema } from "../../Validation/DashboardSchema";
import toast from "react-hot-toast";

const Dashboard = () => {
  const today = new Date().toISOString().split("T")[0]; // default today
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: today,
  });
  const [errors, setErrors] = useState({});

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const submit = async () => {
    try {
      await Dashboardschema.validate(formData, { abortEarly: false });

      await addTransaction(formData);

      fetchTransactions();

      setFormData({
        title: "",
        amount: "",
        type: "expense",
        date: today,
      });
      setErrors({});

      toast.success("Transaction added successfully!"); // ✅ Success toast
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        toast.error("Please fix the errors in the form."); // ❌ Error toast
      } else {
        toast.error(err.message); // ❌ Error toast
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 550,
        margin: "50px auto",
        padding: 25,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f6f8",
        borderRadius: 10,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 25, color: "#333" }}>
        Transaction Dashboard
      </h2>

      {/* Title Input */}
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            color: "#555",
          }}
        >
          Title
        </label>
        <input
          name="title"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        {errors.title && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
            {errors.title}
          </div>
        )}
      </div>

      {/* Amount Input */}
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            color: "#555",
          }}
        >
          Amount
        </label>
        <input
          name="amount"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        {errors.amount && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
            {errors.amount}
          </div>
        )}
      </div>

      {/* Type Selector */}
      <div style={{ marginBottom: 22 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            color: "#555",
          }}
        >
          Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            backgroundColor: "#fff",
            outline: "none",
            transition: "border 0.2s",
          }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
            {errors.type}
          </div>
        )}
      </div>

      {/* Date Input */}
      <div style={{ marginBottom: 25 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            color: "#555",
          }}
        >
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
            outline: "none",
            transition: "border 0.2s",
            backgroundColor: "#fff",
          }}
        />
        {errors.date && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
            {errors.date}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={submit}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 6,
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
      >
        Add Transaction
      </button>

      {/* Transactions List */}
      <h3
        style={{
          marginTop: 35,
          borderBottom: "1px solid #ccc",
          paddingBottom: 10,
          color: "#333",
        }}
      >
        Transactions
      </h3>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {transactions.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              marginBottom: 8,
              borderRadius: 6,
              backgroundColor: t.type === "income" ? "#e3f2fd" : "#ffebee",
              border: "1px solid #ddd",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              fontSize: 14,
              color: "#333",
            }}
          >
            <span>{t.title}</span>
            <span>
              {t.amount} ({t.type})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Dashboard;
