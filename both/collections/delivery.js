this.Delivery = new Mongo.Collection("delivery");

this.Delivery.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager","factory"]);
}

this.Delivery.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager","factory"]);
}

this.Delivery.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
