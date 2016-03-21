Meteor.publish("item_list", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Items.publishJoinedCursors(Items.find({}, {sort:{sku:1}}));
	}
	return this.ready();
});

Meteor.publish("items_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Items.publishJoinedCursors(Items.find({_id:null}, {}));
	}
	return this.ready();
});

Meteor.publish("item_details", function(itemId) {
	if(Users.isInRoles(this.userId, ["admin","manager","s_manager","factory","user","salesman"])) {
		return Items.publishJoinedCursors(Items.find({_id:itemId}, {}));
	}
	return this.ready();
});

