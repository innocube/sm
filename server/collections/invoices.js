Invoices.allow({
	insert: function (userId, doc) {
		return Invoices.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Invoices.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Invoices.userCanRemove(userId, doc);
	}
});

Invoices.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
if (Meteor.user().roles == "s_manager") { Customers.find({ _id: doc.customerId }).map(function(c) { doc.ownerId = c.ownerId; }); } if(!doc.totalAmount) doc.totalAmount = 0; doc.orderedBy = Meteor.user().profile.name; var max = 0; var invoiceNumbers = Invoices.find({}, { fields: { invoiceNumber: 1 }}).fetch(); _.each(invoiceNumbers, function(doc) { var intNum = parseInt(doc.invoiceNumber); if(!isNaN(intNum) && intNum > max) max = intNum; }); doc.invoiceNumber = max + 1;
});

Invoices.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Invoices.before.remove(function(userId, doc) {
	
var invoice = Invoices.findOne({ invoiceNumber: doc.invoiceNumber }); InvoiceItems.remove({ invoiceId: invoice._id });
});

Invoices.after.insert(function(userId, doc) {
	
});

Invoices.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Invoices.after.remove(function(userId, doc) {
	
});
