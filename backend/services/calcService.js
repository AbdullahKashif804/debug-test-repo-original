const calculateTotal = (transactions) => {
  let total = 0;
  for (let t of transactions) {
    if (t.type === "income") {
      total += t.amount;
    } else if (t.type === "expense") {
      total -= t.amount;
    }
  }
  return total;
}
module.exports = { calculateTotal };
