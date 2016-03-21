this.Payments = new Mongo.Collection("payments");

this.Payments.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager"]);
}

this.Payments.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}

this.Payments.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
