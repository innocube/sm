this.OrderCustomersEditController = RouteController.extend({
	template: "OrderCustomersEdit",
	

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
			Meteor.subscribe("customer_details", this.params.customerId),
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
			customer_details: Customers.findOne({_id:this.params.customerId}, {transform:function(doc) { var sum = 0; Invoices.find({ customerId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }}),
			invoice_list: Invoices.find({}, {sort:{invoiceNumber:-1}})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});