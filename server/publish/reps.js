Meteor.publish("rep_list", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user"])) {
		return Reps.find({}, {transform:function(doc) { var sum = 0; Invoices.find({ ownerId: doc._id }).map(function(item) { if(item.totalAmount) sum += item.totalAmount; }); doc.totalAmount = sum; return doc; },sort:["name"]});
	}
	return this.ready();
});

Meteor.publish("reps_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user"])) {
		return Reps.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("rep_details", function(repId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user"])) {
		return Reps.find({_id:repId}, {transform:function(doc) { var sum = 0; Invoices.find({ ownerId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }});
	}
	return this.ready();
});

