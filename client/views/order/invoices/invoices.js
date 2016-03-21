var pageSession = new ReactiveDict();

Template.OrderInvoices.rendered = function() {
	
};

Template.OrderInvoices.events({
	
});

Template.OrderInvoices.helpers({
	
});

var OrderInvoicesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrderInvoicesViewSearchString");
	var sortBy = pageSession.get("OrderInvoicesViewSortBy");
	var sortAscending = pageSession.get("OrderInvoicesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["customerId", "customer.name", "invoiceNumber", "date", "orderedBy", "totalAmount", "totalPaid", "VAT", "shippingStatus", "shipDate", "note"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var OrderInvoicesViewExport = function(cursor, fileType) {
	var data = OrderInvoicesViewItems(cursor);
	var exportFields = ["customer.name", "invoiceNumber", "date", "orderedBy", "totalAmount", "totalPaid", "VAT", "shippingStatus", "shipDate", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrderInvoicesView.rendered = function() {
	pageSession.set("OrderInvoicesViewStyle", "table");
	
};

Template.OrderInvoicesView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("OrderInvoicesViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("OrderInvoicesViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("OrderInvoicesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("order.invoices.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		OrderInvoicesViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrderInvoicesViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrderInvoicesViewExport(this.invoice_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrderInvoicesViewExport(this.invoice_list, "json");
	}

	
});

Template.OrderInvoicesView.helpers({

	"insertButtonClass": function() {
		return Invoices.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.invoice_list || this.invoice_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.invoice_list && this.invoice_list.count() > 0;
	},
	"isNotFound": function() {
		return this.invoice_list && pageSession.get("OrderInvoicesViewSearchString") && OrderInvoicesViewItems(this.invoice_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrderInvoicesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrderInvoicesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrderInvoicesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrderInvoicesViewStyle") == "gallery";
	}

	
});


Template.OrderInvoicesViewTable.rendered = function() {
	
};

Template.OrderInvoicesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrderInvoicesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrderInvoicesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrderInvoicesViewSortAscending") || false;
			pageSession.set("OrderInvoicesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("OrderInvoicesViewSortAscending", true);
		}
	}
});

Template.OrderInvoicesViewTable.helpers({
	"tableItems": function() {
		var i_list = this.invoice_list;

		var user = Users.findOne();
		//console.log("User is " + user._id);
		if (user.roles == "salesman") {
			//console.log(">>> Salesman!!");
			i_list = Invoices.find({ownerId: user._id}, {});
		}

		return OrderInvoicesViewItems(i_list);
	}
});


Template.OrderInvoicesViewTableItems.rendered = function() {
	
};

Template.OrderInvoicesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("order.invoices.details", {invoiceId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Invoices.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Invoices.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("order.invoices.edit", {invoiceId: this._id});
		return false;
	}
});

Template.OrderInvoicesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Invoices.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Invoices.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
