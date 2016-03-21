this.ShopRepsController = RouteController.extend({
	template: "ShopReps",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("rep_list"),
			Meteor.subscribe("invoice_list")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			rep_list: Reps.find({}, {transform:function(doc) { var sum = 0; Invoices.find({ ownerId: doc._id }).map(function(item) { if(item.totalAmount) sum += item.totalAmount; }); doc.totalAmount = sum; return doc; },sort:["name"]}),
			invoice_list: Invoices.find({}, {sort:{invoiceNumber:-1}})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});