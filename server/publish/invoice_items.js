Meteor.publish("invoice_items", function(invoiceId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","salesman","user"])) {
		return InvoiceItems.publishJoinedCursors(InvoiceItems.find({invoiceId:invoiceId}, {}));
	}
	return InvoiceItems.publishJoinedCursors(InvoiceItems.find({invoiceId:invoiceId,ownerId:this.userId}, {}));
});

Meteor.publish("invoice_items_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","salesman","user"])) {
		return InvoiceItems.publishJoinedCursors(InvoiceItems.find({_id:null}, {}));
	}
	return InvoiceItems.publishJoinedCursors(InvoiceItems.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("invoice_item", function(itemId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","salesman","user"])) {
		return InvoiceItems.publishJoinedCursors(InvoiceItems.find({_id:itemId}, {}));
	}
	return InvoiceItems.publishJoinedCursors(InvoiceItems.find({_id:itemId,ownerId:this.userId}, {}));
});

