export async function getTransactions() {
  const res = await fetch("http://localhost:4000/api/transactions");
  return res.json(); // ❌ No error handling
}

export async function addTransaction(data) {
  const res = await fetch("http://localhost:4000/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
