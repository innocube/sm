var pageSession = new ReactiveDict();

Template.OrderFinanceDetailsPayments.rendered = function() {
	
};

Template.OrderFinanceDetailsPayments.events({
	
});

Template.OrderFinanceDetailsPayments.helpers({
	
});

var OrderFinanceDetailsPaymentsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrderFinanceDetailsPaymentsViewSearchString");
	var sortBy = pageSession.get("OrderFinanceDetailsPaymentsViewSortBy");
	var sortAscending = pageSession.get("OrderFinanceDetailsPaymentsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["date", "paid", "note"];
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

var OrderFinanceDetailsPaymentsViewExport = function(cursor, fileType) {
	var data = OrderFinanceDetailsPaymentsViewItems(cursor);
	var exportFields = ["date", "paid", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrderFinanceDetailsPaymentsView.rendered = function() {
	pageSession.set("OrderFinanceDetailsPaymentsViewStyle", "table");
	
};

Template.OrderFinanceDetailsPaymentsView.events({
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
				pageSession.set("OrderFinanceDetailsPaymentsViewSearchString", searchString);
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
					pageSession.set("OrderFinanceDetailsPaymentsViewSearchString", searchString);
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
					pageSession.set("OrderFinanceDetailsPaymentsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("order.finance.details.insert", {invoiceId: this.params.invoiceId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		OrderFinanceDetailsPaymentsViewExport(this.payment_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrderFinanceDetailsPaymentsViewExport(this.payment_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrderFinanceDetailsPaymentsViewExport(this.payment_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrderFinanceDetailsPaymentsViewExport(this.payment_list, "json");
	}

	
});

Template.OrderFinanceDetailsPaymentsView.helpers({

	"insertButtonClass": function() {
		return Payments.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.payment_list || this.payment_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.payment_list && this.payment_list.count() > 0;
	},
	"isNotFound": function() {
		return this.payment_list && pageSession.get("OrderFinanceDetailsPaymentsViewSearchString") && OrderFinanceDetailsPaymentsViewItems(this.payment_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrderFinanceDetailsPaymentsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrderFinanceDetailsPaymentsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrderFinanceDetailsPaymentsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrderFinanceDetailsPaymentsViewStyle") == "gallery";
	}

	
});


Template.OrderFinanceDetailsPaymentsViewTable.rendered = function() {
	
};

Template.OrderFinanceDetailsPaymentsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrderFinanceDetailsPaymentsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrderFinanceDetailsPaymentsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrderFinanceDetailsPaymentsViewSortAscending") || false;
			pageSession.set("OrderFinanceDetailsPaymentsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("OrderFinanceDetailsPaymentsViewSortAscending", true);
		}
	}
});

Template.OrderFinanceDetailsPaymentsViewTable.helpers({
	"tableItems": function() {
		return OrderFinanceDetailsPaymentsViewItems(this.payment_list);
	}
});


Template.OrderFinanceDetailsPaymentsViewTableItems.rendered = function() {
	
};

Template.OrderFinanceDetailsPaymentsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Payments.update({ _id: this._id }, { $set: values });

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
						Payments.remove({ _id: me._id });
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
		Router.go("order.finance.details.edit", {invoiceId: UI._parentData(1).params.invoiceId, paymentId: this._id});
		return false;
	}
});

Template.OrderFinanceDetailsPaymentsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Payments.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Payments.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
