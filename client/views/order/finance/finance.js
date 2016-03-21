var pageSession = new ReactiveDict();

Template.OrderFinance.rendered = function() {
	
};

Template.OrderFinance.events({
	
});

Template.OrderFinance.helpers({
	
});

var OrderFinanceViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrderFinanceViewSearchString");
	var sortBy = pageSession.get("OrderFinanceViewSortBy");
	var sortAscending = pageSession.get("OrderFinanceViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["customer.name", "invoiceNumber", "date", "orderedBy", "shippingStatus", "totalAmount", "totalPaid", "check"];
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

var OrderFinanceViewExport = function(cursor, fileType) {
	var data = OrderFinanceViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrderFinanceView.rendered = function() {
	pageSession.set("OrderFinanceViewStyle", "table");
	
};

Template.OrderFinanceView.events({
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
				pageSession.set("OrderFinanceViewSearchString", searchString);
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
					pageSession.set("OrderFinanceViewSearchString", searchString);
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
					pageSession.set("OrderFinanceViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		OrderFinanceViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrderFinanceViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrderFinanceViewExport(this.invoice_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrderFinanceViewExport(this.invoice_list, "json");
	}

	
});

Template.OrderFinanceView.helpers({

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
		return this.invoice_list && pageSession.get("OrderFinanceViewSearchString") && OrderFinanceViewItems(this.invoice_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrderFinanceViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrderFinanceViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrderFinanceViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrderFinanceViewStyle") == "gallery";
	}

	
});


Template.OrderFinanceViewTable.rendered = function() {
	
};

Template.OrderFinanceViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrderFinanceViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrderFinanceViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrderFinanceViewSortAscending") || false;
			pageSession.set("OrderFinanceViewSortAscending", !sortAscending);
		} else {
			pageSession.set("OrderFinanceViewSortAscending", true);
		}
	}
});

Template.OrderFinanceViewTable.helpers({
	"tableItems": function() {
		return OrderFinanceViewItems(this.invoice_list);
	}
});


Template.OrderFinanceViewTableItems.rendered = function() {
	
};

Template.OrderFinanceViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("order.finance.details", {invoiceId: this._id});
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
		/**/
		return false;
	}
});

Template.OrderFinanceViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Invoices.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Invoices.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
