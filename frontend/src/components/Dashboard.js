import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction } from "../api";
import { Dashboardschema } from "../../Validation/DashboardSchema";

const Dashboard=() =>{
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    getTransactions().then(data => {
      setTransactions(data);
    });
  }, []); // Empty Dependent Array, Only get data Once

  const submit = async () => {
      await transactionSchema.validate(             // Validating inputs
        { title, amount },
      );

    await addTransaction({ title, amount, type: "expense" });
    const data = await getTransactions(); //fetch updated list
    //for empty fields on Successfull Submission
      setTitle("");
      setAmount("");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input 
      placeholder="title" 
      value={title} //now react handles this
      onChange={e => setTitle(e.target.value)} />
      <input 
      placeholder="amount" 
      value={amount} //now react handles this
      onChange={e => setAmount(e.target.value)} />
      <button onClick={submit}>Add</button>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>{t.title} - {t.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;