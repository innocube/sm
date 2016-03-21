Meteor.publish("cat_list", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Cats.find({}, {sort:{cat:1}});
	}
	return this.ready();
});

Meteor.publish("cats_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Cats.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("cat_details", function(catId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Cats.find({_id:catId}, {});
	}
	return this.ready();
});

