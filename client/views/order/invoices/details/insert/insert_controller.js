this.OrderInvoicesDetailsInsertController = RouteController.extend({
	template: "OrderInvoicesDetails",
	

	yieldTemplates: {
		'OrderInvoicesDetailsInsert': { to: 'OrderInvoicesDetailsSubcontent'}
		
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
			Meteor.subscribe("cat_list"),
			Meteor.subscribe("item_list"),
			Meteor.subscribe("invoice_items_empty"),
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
			cat_list: Cats.find({}, {sort:{cat:1}}),
			item_list: Items.find({}, {sort:{sku:1}}),
			invoice_items_empty: InvoiceItems.findOne({_id:null}, {}),
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});