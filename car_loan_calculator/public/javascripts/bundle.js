(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

function unique_pred(list, compare) {
  var ptr = 1
    , len = list.length
    , a=list[0], b=list[0]
  for(var i=1; i<len; ++i) {
    b = a
    a = list[i]
    if(compare(a, b)) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique_eq(list) {
  var ptr = 1
    , len = list.length
    , a=list[0], b = list[0]
  for(var i=1; i<len; ++i, b=a) {
    b = a
    a = list[i]
    if(a !== b) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique(list, compare, sorted) {
  if(list.length === 0) {
    return list
  }
  if(compare) {
    if(!sorted) {
      list.sort(compare)
    }
    return unique_pred(list, compare)
  }
  if(!sorted) {
    list.sort()
  }
  return unique_eq(list)
}

module.exports = unique

},{}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
var carLoanCalculator = require('./carLoanCalculator');
var unique = require('uniq');


// DOM Ready =================================================
$(document).ready(function() {
	// Add User button click
	$('#calculator').on('click', addUser);
	// Populate the user table on initial page load
	populateTable();

});

// Functions =================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON

	$.getJSON('/users/userlist', function(data) {

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			for(var i=1; i<=this.fullterm; i++) {
				var values = new carLoanCalculator(this.amount, this.interest, this.fullterm, i);

				tableContent += '<tr>'
				tableContent += '<td>' + i + '</td>';
				tableContent += '<td>' + this.amount + '</td>';
				tableContent += '<td>' + this.interest + '</td>';
				tableContent += '<td>' + values.payment() + '</td>';
				tableContent += '<td>' + values.balanceSimple() + '</td>';
				tableContent += '<td>' + values.balanceNonSimple() + '</td>';
			}
		});

		// Inject the whole content string into our existing HTML table
		$('#tablevalues table tbody').html(tableContent);
	});
};


// Add User
function addUser(event) {
	event.preventDefault();

	// Basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#calculator').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		// If it is, compile all user info into one object
		var newUser = {
			'amount': $('#amount').val(),
			'interest': $('#interest').val(),
			'fullterm': $('#fullterm').val(),
			'month': $('#month').val(),
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/calculate',
			dataType: 'JSON'
		}).done(function(response) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#calculator').val('');

				// Update the table
				populateTable();
			}
			else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}
		});
	}
	else {

		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}
},{"./carLoanCalculator":2,"uniq":1}]},{},[3]);
