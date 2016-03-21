this.OrderFinanceDetailsInsertController = RouteController.extend({
	template: "OrderFinanceDetails",
	

	yieldTemplates: {
		'OrderFinanceDetailsInsert': { to: 'OrderFinanceDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("OrderFinanceDetails"); this.render("loading", { to: "OrderFinanceDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("payment_empty"),
			Meteor.subscribe("invoice_details", this.params.invoiceId)
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
			payment_empty: Payments.findOne({_id:null}, {}),
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});