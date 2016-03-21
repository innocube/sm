Payments.allow({
	insert: function (userId, doc) {
		return Payments.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Payments.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Payments.userCanRemove(userId, doc);
	}
});

Payments.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Payments.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Payments.before.remove(function(userId, doc) {
	
});

Payments.after.insert(function(userId, doc) {
	
var paid = 0; Payments.find({ invoiceId: doc.invoiceId }).map(function(payment) { paid += payment.paid; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalPaid: paid }}); Invoices.find({ _id: doc.invoiceId }).map(function(inv) { doc.customerId = inv.customerId; Customers.update({ _id: doc.customerId }, { $set: { totalPaid: paid }}); }); var repId = ""; Customers.find({ _id: doc.customerId }).map(function(cust) { repId = cust.ownerId; }); var totalPaid = 0; Customers.find({ ownerId: repId }).map(function(custs) { if (!custs.totalPaid) custs.totalPaid = 0; totalPaid += custs.totalPaid; }); Reps.update({ _id: repId }, { $set: { totalPaid: totalPaid }}); 
});

Payments.after.update(function(userId, doc, fieldNames, modifier, options) {
	
var paid = 0; Payments.find({ invoiceId: doc.invoiceId }).map(function(payment) { paid += payment.paid; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalPaid: paid }}); Invoices.find({ _id: doc.invoiceId }).map(function(inv) { doc.customerId = inv.customerId; Customers.update({ _id: doc.customerId }, { $set: { totalPaid: paid }}); }); var repId = ""; Customers.find({ _id: doc.customerId }).map(function(cust) { repId = cust.ownerId; }); var totalPaid = 0; Customers.find({ ownerId: repId }).map(function(custs) { if (!custs.totalPaid) custs.totalPaid = 0; totalPaid += custs.totalPaid; }); Reps.update({ _id: repId }, { $set: { totalPaid: totalPaid }}); 
});

Payments.after.remove(function(userId, doc) {
	
var paid = 0; Payments.find({ invoiceId: doc.invoiceId }).map(function(payment) { paid += payment.paid; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalPaid: paid }}); Invoices.find({ _id: doc.invoiceId }).map(function(inv) { doc.customerId = inv.customerId; Customers.update({ _id: doc.customerId }, { $set: { totalPaid: paid }}); }); var repId = ""; Customers.find({ _id: doc.customerId }).map(function(cust) { repId = cust.ownerId; }); var totalPaid = 0; Customers.find({ ownerId: repId }).map(function(custs) { if (!custs.totalPaid) custs.totalPaid = 0; totalPaid += custs.totalPaid; }); Reps.update({ _id: repId }, { $set: { totalPaid: totalPaid }}); 
});
