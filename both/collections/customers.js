this.Customers = new Mongo.Collection("customers");

this.Customers.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","s_manager","salesman"]);
}

this.Customers.userCanUpdate = function(userId, doc) {
	return userId && (doc.ownerId == userId || Users.isInRoles(userId, ["admin","manager"]));
}

this.Customers.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
