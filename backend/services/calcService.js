const calculateTotal=(transactions)=> {
  let total = 0;
  for (let t of transactions) {
    if (t.type === "income") {
      total += t.amount;
    } else {
      total -= t.amount; // expense should subtract
    }
  }
  return total;
}
module.exports = { calculateTotal };
