const calculateTotal = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  
  for (let t of transactions) {
    const amount = parseFloat(t.amount) || 0;
    if (t.type === "income") {
      totalIncome += amount;
    } else if (t.type === "expense") {
      totalExpense += amount;
    }
  }
  
  const netBalance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    netBalance,
    transactionCount: transactions.length
  };
};

module.exports = { calculateTotal };
