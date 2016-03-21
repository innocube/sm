Delivery.allow({
	insert: function (userId, doc) {
		return Delivery.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Delivery.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Delivery.userCanRemove(userId, doc);
	}
});

Delivery.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Delivery.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Delivery.before.remove(function(userId, doc) {
	
});

Delivery.after.insert(function(userId, doc) {
	
});

Delivery.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Delivery.after.remove(function(userId, doc) {
	
});
