const getTransactions=async()=> {
  try {
    const res = await fetch("http://localhost:4000/api/transactions");
    return await res.json();
  } catch (err) {
    console.error("Error fetching transactions:", err); //error handling and no app crash
  }
}

const addTransaction= async(data)=> {
  try {
    const res = await fetch("http://localhost:4000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error("Error adding transaction:", err); //added try/catch block here also for error handling 
  }
}

export { getTransactions, addTransaction };