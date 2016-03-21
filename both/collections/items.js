this.Items = new Mongo.Collection("items");

this.Items.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager"]);
}

this.Items.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}

this.Items.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
