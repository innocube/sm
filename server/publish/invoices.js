Meteor.publish("invoice_list", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Invoices.publishJoinedCursors(Invoices.find({}, {sort:{invoiceNumber:-1}}));
	}
	return Invoices.publishJoinedCursors(Invoices.find({ownerId:this.userId}, {sort:{invoiceNumber:-1}}));
});

Meteor.publish("invoices_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Invoices.publishJoinedCursors(Invoices.find({_id:null}, {}));
	}
	return Invoices.publishJoinedCursors(Invoices.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("invoice_details", function(invoiceId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Invoices.publishJoinedCursors(Invoices.find({_id:invoiceId}, {}));
	}
	return Invoices.publishJoinedCursors(Invoices.find({_id:invoiceId,ownerId:this.userId}, {}));
});

