Reps.allow({
	insert: function (userId, doc) {
		return Reps.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Reps.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Reps.userCanRemove(userId, doc);
	}
});

Reps.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Reps.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Reps.before.remove(function(userId, doc) {
	
});

Reps.after.insert(function(userId, doc) {
	
});

Reps.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Reps.after.remove(function(userId, doc) {
	
});
