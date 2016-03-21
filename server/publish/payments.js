Meteor.publish("payment_list", function(customerId) {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Payments.find({customerId:customerId}, {});
	}
	return this.ready();
});

Meteor.publish("payment_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Payments.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("payment_details", function(paymentId) {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Payments.find({_id:paymentId}, {});
	}
	return this.ready();
});

