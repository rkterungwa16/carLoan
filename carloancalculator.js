function carloanCalculator(d, i, n, m) {
	this.d = d; //Amount borrowed
	this.i = i; //Interest rate
	this.n = n; //total number of months
	this.m = m; //desired month
}

carloanCalculator.prototype.factorA = function() {
	return (1 + this.i/12);
}


carloanCalculator.prototype.payment = function() {
	return (this.d*(this.factorA() - 1)*Math.pow(this.factorA(), this.n))/
	(Math.pow(this.factorA(), this.n) - 1);
}

carloanCalculator.prototype.balanceSimple = function() {
	return (this.d * Math.pow(this.factorA(), this.m)) - (this.payment() *
		(Math.pow(this.factorA(), this.m)-1))/(this.factorA() - 1);
}

carloanCalculator.prototype.cumulative = function() {
	return ((this.payment() * this.m) - this.d + this.balanceSimple());
}

carloanCalculator.prototype.cumulative12term = function() {
	var twelfthTerm = new carloanCalculator(this.d, this.i, this.n, 12);
	return ((twelfthTerm.payment() * twelfthTerm.m) - twelfthTerm.d +
		twelfthTerm.balanceSimple());
}

carloanCalculator.prototype.balanceNonSimple = function() {
	return this.d - this.payment() * this.m +
	this.cumulative12term() * (1 - ((this.n - 12) * (this.n - 12 + 1))) /
	(this.n * (this.n + 1));
}



var mine = new carloanCalculator(10000,0.07,36,1);
console.log(mine.factorA());
console.log("payments " + mine.payment());
console.log("balancesimple " + mine.balanceSimple());
console.log("cumulative " + mine.cumulative());
console.log("balanceNonSimple " + mine.balanceNonSimple());
console.log("cumulative12term " + mine.cumulative12term());




