import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction, getTransactionSummary } from "../services/api";
import { Dashboardschema } from "../schemas/dashboardSchema";
import toast from "react-hot-toast";

const Dashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: today,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0 });

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data || []);
  };

  const fetchSummary = async () => {
    const data = await getTransactionSummary();
    setSummary(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submit = async () => {
    try {
      setLoading(true);
      await Dashboardschema.validate(formData, { abortEarly: false });
      await addTransaction(formData);
      await fetchTransactions();
      await fetchSummary();

      setFormData({
        title: "",
        amount: "",
        type: "expense",
        date: today,
      });
      setErrors({});
      toast.success("Transaction added successfully!");
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        toast.error("Please fix the form errors.");
      } else {
        toast.error(err.message || "Failed to add transaction.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
      await fetchSummary();
      toast.success("Transaction deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete transaction.");
    }
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

      {/* Summary Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            padding: "16px 32px",
            borderRadius: 12,
            background: summary.total >= 0
              ? "linear-gradient(135deg, #e8f5e9, #c8e6c9)"
              : "linear-gradient(135deg, #ffebee, #ffcdd2)",
            border: `1px solid ${summary.total >= 0 ? "#a5d6a7" : "#ef9a9a"}`,
            textAlign: "center",
            minWidth: 200,
          }}
        >
          <div style={{ fontSize: 13, color: "#666", fontWeight: 500, marginBottom: 4 }}>
            Total Balance
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: summary.total >= 0 ? "#2e7d32" : "#c62828",
            }}
          >
            {summary.total >= 0 ? "+" : "-"}${Math.abs(summary.total).toLocaleString()}
          </div>
        </div>
      </div>

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
            border: errors.title ? "1px solid #d32f2f" : "1px solid #90caf9",
            fontSize: 14,
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
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
          type="number"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: errors.amount ? "1px solid #d32f2f" : "1px solid #90caf9",
            fontSize: 14,
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
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
            border: errors.type ? "1px solid #d32f2f" : "1px solid #90caf9",
            fontSize: 14,
            backgroundColor: "#fff",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
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
            border: errors.date ? "1px solid #d32f2f" : "1px solid #90caf9",
            fontSize: 14,
            outline: "none",
            backgroundColor: "#fff",
            transition: "all 0.2s",
            boxSizing: "border-box",
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
        disabled={loading}
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 10,
          background: loading
            ? "#b0bec5"
            : "linear-gradient(90deg, #42a5f5, #1e88e5)",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 16,
          transition: "all 0.3s",
        }}
        onMouseOver={(e) => {
          if (!loading)
            e.currentTarget.style.background =
              "linear-gradient(90deg, #1e88e5, #1565c0)";
        }}
        onMouseOut={(e) => {
          if (!loading)
            e.currentTarget.style.background =
              "linear-gradient(90deg, #42a5f5, #1e88e5)";
        }}
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>

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

      {transactions.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#999",
            marginTop: 20,
            fontStyle: "italic",
          }}
        >
          No transactions yet. Add one above!
        </p>
      ) : (
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
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0,0,0,0.05)";
              }}
            >
              <span>
                <strong>{t.title}</strong>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    color: t.type === "income" ? "#2e7d32" : "#c62828",
                    fontWeight: 600,
                  }}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </span>
                <span
                  style={{
                    backgroundColor:
                      t.type === "income" ? "#c8e6c9" : "#ffcdd2",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {t.type}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    background: "none",
                    border: "1px solid #ef5350",
                    color: "#ef5350",
                    borderRadius: 6,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#ef5350";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#ef5350";
                  }}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
