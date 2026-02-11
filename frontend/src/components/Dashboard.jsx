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
        toast.error("Please fill the form."); // ❌ Error toast
      } else {
        toast.error(err.message); // ❌ Error toast
      }
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
