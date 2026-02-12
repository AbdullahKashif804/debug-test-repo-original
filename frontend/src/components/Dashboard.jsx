import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction, getSummary } from "../service/api";
import { Dashboardschema } from "../Validation/DashboardSchema";
import toast from "react-hot-toast";

const Dashboard = () => {
  const today = new Date().toISOString().split("T")[0]; // default today
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
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
    try {
      const data = await getTransactions();
      // backend returns { success, transactions, total } or { success, data: { transactions } }
      const txs = (data && (data.transactions || data.data?.transactions)) || [];
      setTransactions(txs);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const submit = async () => {
    try {
      // Coerce amount to number before validation/submission
      const payload = { ...formData, amount: Number(formData.amount) };
      await Dashboardschema.validate(payload, { abortEarly: false });

      const res = await addTransaction(payload);

      if (res && res.success) {
        const tx = res.data || res.transaction || res;
        setTransactions((prev) => [...prev, tx]);
        toast.success(res.message || "Transaction added");
      }

      setFormData({ title: "", amount: "", type: "expense", date: today });
      setErrors({});

    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill the form."); // ❌ Error toast
      } else {
        toast.error(err.message); // ❌ Error toast
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteTransaction(id);
      
      if (res.success) {
        // Remove transaction from state
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success(res.message || "Transaction deleted successfully");
        // Update summary if it's visible
        if (showSummary) {
          fetchSummary();
        }
      }
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getSummary();
      if (res && res.success) {
        setSummary(res.data || res.summary || res);
      }
    } catch (err) {
      toast.error("Failed to fetch summary");
      console.error(err);
    }
  };

  const toggleSummary = () => {
    if (!showSummary) {
      fetchSummary();
    }
    setShowSummary(!showSummary);
  };

 return (
  <div
    style={{
      maxWidth: 620,
      margin: "60px auto",
      padding: 32,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(145deg, #e0f7fa, #ffffff)",
      borderRadius: 16,
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        marginBottom: 32,
        color: "#0d47a1",
        fontSize: 26,
        fontWeight: 700,
      }}
    >
      Transaction Dashboard
    </h2>

    {/* Title Input */}
    <div style={{ marginBottom: 20 }}>
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
          padding: 14,
          borderRadius: 10,
          border: "1px solid #90caf9",
          fontSize: 14,
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 10px rgba(25, 118, 210, 0.3)")
        }
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      />
      {errors.title && (
        <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
          {errors.title}
        </div>
      )}
    </div>

    {/* Amount Input */}
    <div style={{ marginBottom: 20 }}>
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
          padding: 14,
          borderRadius: 10,
          border: "1px solid #90caf9",
          fontSize: 14,
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 10px rgba(25, 118, 210, 0.3)")
        }
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
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
          padding: 14,
          borderRadius: 10,
          border: "1px solid #90caf9",
          fontSize: 14,
          backgroundColor: "#fff",
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 10px rgba(25, 118, 210, 0.3)")
        }
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
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
    <div style={{ marginBottom: 28 }}>
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
          padding: 14,
          borderRadius: 10,
          border: "1px solid #90caf9",
          fontSize: 14,
          outline: "none",
          backgroundColor: "#fff",
          transition: "all 0.2s",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.boxShadow =
            "0 0 10px rgba(25, 118, 210, 0.3)")
        }
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      />
      {errors.date && (
        <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>
          {errors.date}
        </div>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="button"
      onClick={submit}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 10,
        background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
        color: "#fff",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        transition: "all 0.3s",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #1e88e5, #1565c0)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(90deg, #42a5f5, #1e88e5)")
      }
    >
      Add Transaction
    </button>

    {/* Summary Button */}
    <button
      type="button"
      onClick={toggleSummary}
      style={{
        width: "100%",
        padding: 14,
        marginTop: 16,
        borderRadius: 10,
        background: showSummary
          ? "linear-gradient(90deg, #66bb6a, #43a047)"
          : "linear-gradient(90deg, #ffa726, #fb8c00)",
        color: "#fff",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        fontSize: 15,
        transition: "all 0.3s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {showSummary ? "Hide Summary" : "Show Summary"}
    </button>

    {/* Summary Display */}
    {showSummary && summary && (
      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 12,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Financial Summary
        </h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
            }}
          >
            <span style={{ fontWeight: 500 }}>Total Income:</span>
            <span style={{ fontWeight: 700, color: "#a5d6a7" }}>
              ${summary.totalIncome.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
            }}
          >
            <span style={{ fontWeight: 500 }}>Total Expenses:</span>
            <span style={{ fontWeight: 700, color: "#ef9a9a" }}>
              ${summary.totalExpense.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: 8,
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 16 }}>Net Balance:</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: summary.netBalance >= 0 ? "#a5d6a7" : "#ef9a9a",
              }}
            >
              ${summary.netBalance.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 8,
              fontSize: 13,
              opacity: 0.9,
            }}
          >
            Total Transactions: {summary.transactionCount}
          </div>
        </div>
      </div>
    )}

    {/* Transactions List */}
    <h3
      style={{
        marginTop: 40,
        borderBottom: "2px solid #eee",
        paddingBottom: 10,
        color: "#0d47a1",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      Transactions
    </h3>
    <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
      {transactions.map((t) => (
        <li
          key={t.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            marginBottom: 10,
            borderRadius: 10,
            backgroundColor:
              t.type === "income" ? "#e8f5e9" : "#ffebee",
            border: "1px solid #ddd",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            fontSize: 14,
            color: "#333",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600 }}>{t.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 500 }}>
              ${t.amount} ({t.type})
            </span>
            <button
              onClick={() => handleDelete(t.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#f44336",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#d32f2f";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f44336";
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

};
export default Dashboard;
