var pageSession = new ReactiveDict();

Template.OrderCustomers.rendered = function() {
	
};

Template.OrderCustomers.events({
	
});

Template.OrderCustomers.helpers({
	
});

var OrderCustomersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrderCustomersViewSearchString");
	var sortBy = pageSession.get("OrderCustomersViewSortBy");
	var sortAscending = pageSession.get("OrderCustomersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "address", "totalAmount", "totalPaid", "note"];
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

var OrderCustomersViewExport = function(cursor, fileType) {
	var data = OrderCustomersViewItems(cursor);
	var exportFields = ["name", "phone", "email", "address", "totalAmount", "totalPaid", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrderCustomersView.rendered = function() {
	pageSession.set("OrderCustomersViewStyle", "table");
	
};

Template.OrderCustomersView.events({
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
				pageSession.set("OrderCustomersViewSearchString", searchString);
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
					pageSession.set("OrderCustomersViewSearchString", searchString);
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
					pageSession.set("OrderCustomersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("order.customers.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		OrderCustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrderCustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrderCustomersViewExport(this.customer_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrderCustomersViewExport(this.customer_list, "json");
	}

	
});

Template.OrderCustomersView.helpers({

	"insertButtonClass": function() {
		return Customers.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.customer_list || this.customer_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.customer_list && this.customer_list.count() > 0;
	},
	"isNotFound": function() {
		return this.customer_list && pageSession.get("OrderCustomersViewSearchString") && OrderCustomersViewItems(this.customer_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrderCustomersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrderCustomersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrderCustomersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrderCustomersViewStyle") == "gallery";
	}

	
});


Template.OrderCustomersViewTable.rendered = function() {
	
};

Template.OrderCustomersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrderCustomersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrderCustomersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrderCustomersViewSortAscending") || false;
			pageSession.set("OrderCustomersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("OrderCustomersViewSortAscending", true);
		}
	}
});

Template.OrderCustomersViewTable.helpers({
	"tableItems": function() {
		var c_list = this.customer_list;
		var user = Users.findOne();
		//console.log("User is " + user._id);
		if (user.roles == "salesman") {
			//console.log(">>> Salesman!!");
			c_list = Customers.find({ownerId: user._id}, {transform:function(doc) { var sum = 0; Invoices.find({ customerId: doc._id }).map(function(item) { if(item.totalAmount) sum += item.totalAmount; }); doc.totalAmount = sum; return doc; },sort:["name"]});
		}

		return OrderCustomersViewItems(c_list);
	}
});


Template.OrderCustomersViewTableItems.rendered = function() {
	
};

Template.OrderCustomersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("order.customers.details", {customerId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Customers.update({ _id: this._id }, { $set: values });

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
						Customers.remove({ _id: me._id });
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
		Router.go("order.customers.edit", {customerId: this._id});
		return false;
	}
});

Template.OrderCustomersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Customers.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Customers.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
