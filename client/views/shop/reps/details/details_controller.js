this.ShopRepsDetailsController = RouteController.extend({
	template: "ShopRepsDetails",
	

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
			Meteor.subscribe("rep_details", this.params.repId),
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
			rep_details: Reps.findOne({_id:this.params.repId}, {transform:function(doc) { var sum = 0; Invoices.find({ ownerId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }}),
			invoice_list: Invoices.find({}, {sort:{invoiceNumber:-1}})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});