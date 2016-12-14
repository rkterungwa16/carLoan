const carLoanCalculator = require('./carLoanCalculator');

const values = new carLoanCalculator(10000, 7, 36, 11);

const payment = values.payment();
const balSimple = values.balanceSimple();
const balNonSimple = values.balanceNonSimple();

console.log("Payment ", payment);
console.log("Balance Simple ", balSimple);
console.log("Balance NonSimple ", balNonSimple); 

function calculatePayment() {
    // Look up the input and output elements in the document
    var amount = parseFloat(document.getElementById("amount"));
    var interes = parseFloat(document.getElementById("interest"));
    var fullterm = parseFloat(document.getElementById("fullterm"));
    var month = parseFloat(document.getElementById("month"));
    var payment = document.getElementById("payment");
    var balSimple = document.getElementById("balSimple");
    var balNonSimple = document.getElementById("balNonSimple");
    
    
    var mine = new carLoanCalculator(amount.value, interest.value, 
    	fullterm.value, month.value);

    payment.value = mine.payment();
    balSimple.value = mine.balanceSimple();
    balNonSimple.value = mine.balanceNonSimple();

}

function amortizePayments(amount, interest, fullterm) {
	var tableContent='';

	for(var i=1; i<=36; i++) {
		var mine = new carLoanCalculator(this.amount, this.interest, this.fullterm, i);

			tableContent += '<tr>'
			tableContent += '<td>' + i + '</td>';
			tableContent += '<td>' + amount + '</td>';
			tableContent += '<td>' + interest + '</td>';
			tableContent += '<td>' + mine.payment() + '</td>';
			tableContent += '<td>' + mine.balsimple() + '</td>';
			tableContent += '<td>' + mine.balnonsimple() + '</td>';
	}
}

$.each(data, function() {
			var tableContent='';

	for(var i=1; i<=36; i++) {
		var mine = new carLoanCalculator(this.amount, this.interest, this.fullterm, i);

		tableContent += '<tr>'
		tableContent += '<td>' + i + '</td>';
		tableContent += '<td>' + amount + '</td>';
		tableContent += '<td>' + interest + '</td>';
		tableContent += '<td>' + mine.payment() + '</td>';
		tableContent += '<td>' + mine.balsimple() + '</td>';
		tableContent += '<td>' + mine.balnonsimple() + '</td>';
	}
});