Cats.allow({
	insert: function (userId, doc) {
		return Cats.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Cats.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Cats.userCanRemove(userId, doc);
	}
});

Cats.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Cats.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Cats.before.remove(function(userId, doc) {
	
});

Cats.after.insert(function(userId, doc) {
	
});

Cats.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Cats.after.remove(function(userId, doc) {
	
});
