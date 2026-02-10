import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction } from "../api";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    getTransactions().then(data => {
      setTransactions(data);
    });
  }, [transactions]); // ❌ infinite loop

  const submit = async () => {
    await addTransaction({ title, amount, type: "expense" });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input placeholder="title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="amount" onChange={e => setAmount(e.target.value)} />
      <button onClick={submit}>Add</button>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>{t.title} - {t.amount}</li>
        ))}
      </ul>
    </div>
  );
}
