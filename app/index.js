const carLoanCalculator = require('./carLoanCalculator');

const values = new carLoanCalculator(10000, 7, 36, 11);

const payment = values.payment();
const balSimple = values.balanceSimple();
const balNonSimple = values.balanceNonSimple();

console.log("Payment ", payment);
console.log("Balance Simple ", balSimple);
console.log("Balance NonSimple ", balNonSimple); 