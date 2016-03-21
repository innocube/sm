this.Invoices = new Mongo.Collection("invoices");

this.Invoices.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["s_manager","salesman"]);
}

this.Invoices.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager","s_manager"]);
}

this.Invoices.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
