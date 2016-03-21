this.Reps = new Mongo.Collection("reps");

this.Reps.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager"]);
}

this.Reps.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
}

this.Reps.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
