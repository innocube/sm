this.OrderInvoicesDetailsInvoiceItemsController = RouteController.extend({
	template: "OrderInvoicesDetails",
	

	yieldTemplates: {
		'OrderInvoicesDetailsInvoiceItems': { to: 'OrderInvoicesDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("OrderInvoicesDetails"); this.render("loading", { to: "OrderInvoicesDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("invoice_items", this.params.invoiceId),
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
			invoice_items: InvoiceItems.find({invoiceId:this.params.invoiceId}, {}),
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});