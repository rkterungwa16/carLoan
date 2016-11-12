function carLoanCalculator(d, i, n, m) {
	this.d = d; //Amount borrowed
	this.i = i; //Interest rate
	this.n = n; //Full term = total number of months
	this.m = m; //desired month
}

/**
*
*factorA()
*Factor used in calculating monthly payments
*/
carLoanCalculator.prototype.factorA = function() {
	return (1 + (this.i)*0.01/12);
}

/**
*
*payment()
*Monthly payments at annual interest rate 
*/
carLoanCalculator.prototype.payment = function() {
	return (this.d*(this.factorA() - 1)*Math.pow(this.factorA(), this.n))/
	(Math.pow(this.factorA(), this.n) - 1);
}

/**
*
*balanceSimple()
*Balance of payment after m months. 
*Also called Ballon payment: Final payment that finishes off the loan.
*/
carLoanCalculator.prototype.balanceSimple = function() {
	return (this.d * Math.pow(this.factorA(), this.m)) - (this.payment() *
		(Math.pow(this.factorA(), this.m)-1))/(this.factorA() - 1);
}

/**
*
*cumulative()
*Total interest charge (for simple interest loan) at month m.
*/
carLoanCalculator.prototype.cumulative = function() {
	return ((this.payment() * this.m) - this.d + this.balanceSimple());
}

/**
*
*cumulativeAtFullterm()
*Total simple interest charge at full term.
*/
carLoanCalculator.prototype.cumulativeAtFullterm = function() {
	var fullTerm = new carLoanCalculator(this.d, this.i, this.n, this.n);
	return ((fullTerm.payment() * fullTerm.m) - fullTerm.d +
		fullTerm.balanceSimple());
}

/**
*
*balanceNonSimple()
*Total interest charge of precomputed loan at month m.
*/
carLoanCalculator.prototype.balanceNonSimple = function() {
	return this.d - this.payment() * this.m +
	this.cumulativeAtFullterm() * (1 - ((this.n - this.m) * (this.n - this.m + 1)) /
	(this.n * (this.n + 1)));
}

/**
*
*monthlySimpleInteresPaid()
*Calculates the monthly interest paid on loan.
*/
carLoanCalculator.prototype.monthlySimpleInterestPaid = function() {
	return this.balanceSimple() * (this.factorA() - 1);
}

/**
*
*monthlyNonSimpleInterestPaid()
*Calculates the monthly precomputed  interest charge for loan.
*/
carLoanCalculator.prototype.monthlyNonSimpleInterestPaid = function() {
	var numerator = this.n - this.m + 1;
	var denom = this.n*(this.n+1)/2
	return this.cumulativeAtFullterm()*(numerator/denom);
}


module.exports = carLoanCalculator;

