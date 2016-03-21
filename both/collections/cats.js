this.Cats = new Mongo.Collection("cats");

this.Cats.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager"]);
}

this.Cats.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}

this.Cats.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}
