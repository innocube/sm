Meteor.publish("delivery_list", function(deliveryId) {
	if(Users.isInRoles(this.userId, ["admin","manager","factory","user"])) {
		return Delivery.find({deliveryId:deliveryId}, {});
	}
	return this.ready();
});

Meteor.publish("delivery_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager","factory","user"])) {
		return Delivery.find({_id:null}, {});
	}
	return this.ready();
});

Meteor.publish("delivery_details", function(deliveryId) {
	if(Users.isInRoles(this.userId, ["admin","manager","factory","user"])) {
		return Delivery.find({_id:deliveryId}, {});
	}
	return this.ready();
});

