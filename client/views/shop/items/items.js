var pageSession = new ReactiveDict();

Template.ShopItems.rendered = function() {
	
};

Template.ShopItems.events({
	
});

Template.ShopItems.helpers({
	
});

var ShopItemsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ShopItemsViewSearchString");
	var sortBy = pageSession.get("ShopItemsViewSortBy");
	var sortAscending = pageSession.get("ShopItemsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["catId", "cats.cat", "sku", "description", "price"];
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

var ShopItemsViewExport = function(cursor, fileType) {
	var data = ShopItemsViewItems(cursor);
	var exportFields = ["cats.cat", "sku", "description", "price"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ShopItemsView.rendered = function() {
	pageSession.set("ShopItemsViewStyle", "table");
	
};

Template.ShopItemsView.events({
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
				pageSession.set("ShopItemsViewSearchString", searchString);
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
					pageSession.set("ShopItemsViewSearchString", searchString);
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
					pageSession.set("ShopItemsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("shop.items.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ShopItemsViewExport(this.item_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ShopItemsViewExport(this.item_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ShopItemsViewExport(this.item_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ShopItemsViewExport(this.item_list, "json");
	}

	
});

Template.ShopItemsView.helpers({

	"insertButtonClass": function() {
		return Items.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.item_list || this.item_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.item_list && this.item_list.count() > 0;
	},
	"isNotFound": function() {
		return this.item_list && pageSession.get("ShopItemsViewSearchString") && ShopItemsViewItems(this.item_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ShopItemsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ShopItemsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ShopItemsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ShopItemsViewStyle") == "gallery";
	}

	
});


Template.ShopItemsViewTable.rendered = function() {
	
};

Template.ShopItemsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ShopItemsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ShopItemsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ShopItemsViewSortAscending") || false;
			pageSession.set("ShopItemsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ShopItemsViewSortAscending", true);
		}
	}
});

Template.ShopItemsViewTable.helpers({
	"tableItems": function() {
		return ShopItemsViewItems(this.item_list);
	}
});


Template.ShopItemsViewTableItems.rendered = function() {
	
};

Template.ShopItemsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("shop.items.details", {itemId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Items.update({ _id: this._id }, { $set: values });

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
						Items.remove({ _id: me._id });
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
		Router.go("shop.items.edit", {itemId: this._id});
		return false;
	}
});

Template.ShopItemsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Items.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Items.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
