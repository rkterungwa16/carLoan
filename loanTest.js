var assert = require("assert");
var carLoanCalculator = require("../carLoanCalculator.js");

describe('carLoanCalculator', function() {
	describe('Module carLoanCalculator', function() {
		it('should have a payment Method', function() {
			assert.equal(typeof carLoanCalculator, 'function');
			assert.equal(typeof carLoanCalculator.prototype.payment, 'function');
		});

		it('should have a balanceSimple Method', function() {
			assert.equal(typeof carLoanCalculator.prototype.balanceSimple, 'function');
		});

		it('should have a cumulative Method', function() {
			assert.equal(typeof carLoanCalculator.prototype.cumulative, 'function');
		});

		it('should have a balanceNonSimple Method', function() {
			assert.equal(typeof carLoanCalculator.prototype.balanceNonSimple, 'function');
		});

		it('should have a cumulativeAtFullterm Method', function() {
			assert.equal(typeof carLoanCalculator.prototype.cumulativeAtFullterm, 'function');
		});

		it('should have a factorA Method', function() {
			assert.equal(typeof carLoanCalculator.prototype.factorA, 'function');
		});

		it('factorA() should equal 1.0058', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.factorA() *10000)/10000 , 1.0058);
		});

		it('payment() should equal 308.77', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.payment()*100)/100, 308.77);
		});

		it('balancSimple should equal 7163.41', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.balanceSimple()*100)/100, 7163.41);
		});

		it('cumulative should equal 559.9', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.cumulative()*100)/100, 559.9);
		});

		it('balanceNonSimple should equal 7174.8', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.balanceNonSimple()*100)/100, 7174.8);
		});

		it('cumulativeAtFullterm should equal 1115.75', function() {
			var loan = new carLoanCalculator(10000,0.07,36,11);
			assert.equal(Math.round(loan.cumulativeAtFullterm()*100)/100, 1115.75);
		});
	})
});