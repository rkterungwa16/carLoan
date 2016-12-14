//  Userlist data array for fill info box and amortization table
var userListData = [];

// DOM Ready =================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();

	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#userList table tbody').on('click', 'td a.linkshowuser', calculateAmortization);

});

// Functions =================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/users/userlist', function(data) {

		userListData = data;

		// For each item in our JSON, add a table roww and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
	
};

// Show User info
function showUserInfo(event) {
	// Prevent Link from firing
	event.preventDefault();

	var tableContent = '';

	// Retrieve username from link rel attribute
	var thisUsername = $(this).attr('rel');

	//Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) {
		return arrayItem.username;}).indexOf(thisUsername);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAmount').text(thisUserObject.amount);
	$('#userInfoInterest').text(thisUserObject.interest);
	$('#userInfoFullterm').text(thisUserObject.fullterm);

};

// Add User
function addUser(event) {
	event.preventDefault();

	// Basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {

		// If it is, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#username').val(),
			'email': $('#addUser fieldset input#email').val(),
			'fullname':$('#addUser fieldset input#fullname').val(),
			'amount': $('#addUser fieldset input#amount').val(),
			'interest': $('#addUser fieldset input#interest').val(),
			'fullterm': $('#addUser fieldset input#fullterm').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response) {

			// Check for successfull (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#addUser fieldset input').val('');

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

// Delete User
function deleteUser(event) {

	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do our delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {

			// Check for a successful (blank) response
			if (response.msg === '') {

			}
			else {
				alert('Error: ' + response.msg);
			}

			// Update the table
			populateTable();
		});
	}
	else {

		// If they said no to the confirm, do nothing
		return false;
	}
}


function calculateAmortization(event) {

	// Prevent Link from firing
	event.preventDefault();

	var tableContent = '';

	// Retrieve username from link rel attribute
	var thisUsername = $(this).attr('rel');

	//Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) {
		return arrayItem.username;}).indexOf(thisUsername);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	var amount = parseFloat(thisUserObject.amount);
	var interest = parseFloat(thisUserObject.interest);
	var fullterm = parseFloat(thisUserObject.fullterm);

	for(var i=1; i<=fullterm; i++) {
		var values = new carLoanCalculator(amount, interest, fullterm, i);

		tableContent += '<tr>';
        tableContent += '<td>' + i + '</td>';
        tableContent += '<td>' + amount + '</td>';
        tableContent += '<td>' + interest + '</td>';
        tableContent += '<td>' + values.payment() + '</td>';
        tableContent += '<td>' + values.balanceSimple() + '</td>';
        tableContent += '<td>' + values.balanceNonSimple() + '</td>';
    }

	$('#tablevalues table tbody').html(tableContent);
}
        
function carLoanCalculator(amount, interest, fullterm, month) {
    this.amount = parseFloat(amount);
    this.interest = parseFloat(interest);
    this.fullterm = parseFloat(fullterm);
    this.month = parseFloat(month);

    carLoanCalculator.prototype.factorA = function() {
        return (1 + (this.interest)*0.01/12);
    }


    carLoanCalculator.prototype.payment = function() {
        return (this.amount*(this.factorA() - 1)*Math.pow(this.factorA(), this.fullterm))/
        (Math.pow(this.factorA(), this.fullterm) - 1);
    }


    carLoanCalculator.prototype.balanceSimple = function() {
        return (this.amount * Math.pow(this.factorA(), this.month)) - (this.payment() *
        (Math.pow(this.factorA(), this.month)-1))/(this.factorA() - 1);
    }


    carLoanCalculator.prototype.cumulative = function() {
        return ((this.payment() * this.month) - this.amount + this.balanceSimple());
    }

    carLoanCalculator.prototype.cumulativeAtFullterm = function() {
        var fullTerm = new carLoanCalculator(this.amount, this.interest, this.fullterm, this.fullterm);
        return ((fullTerm.payment() * fullTerm.month) - fullTerm.amount + fullTerm.balanceSimple());
    }


    carLoanCalculator.prototype.balanceNonSimple = function() {
        return this.amount - this.payment() * this.month +
        this.cumulativeAtFullterm() * (1 - ((this.fullterm - this.month) * (this.fullterm - this.month + 1)) /
        (this.fullterm * (this.fullterm + 1)));
                }


    carLoanCalculator.prototype.monthlySimpleInterestPaid = function() {
        return this.balanceSimple() * (this.factorA() - 1);
    }


    carLoanCalculator.prototype.monthlyNonSimpleInterestPaid = function() {
        var numerator = this.fullterm - this.month + 1;
        var denom = this.fullterm*(this.fullterm+1)/2
        return this.cumulativeAtFullterm()*(numerator/denom);
    }


}          