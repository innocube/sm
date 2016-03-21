var pageSession = new ReactiveDict();

Template.ShopCats.rendered = function() {
	
};

Template.ShopCats.events({
	
});

Template.ShopCats.helpers({
	
});

var ShopCatsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ShopCatsViewSearchString");
	var sortBy = pageSession.get("ShopCatsViewSortBy");
	var sortAscending = pageSession.get("ShopCatsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["cat"];
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

var ShopCatsViewExport = function(cursor, fileType) {
	var data = ShopCatsViewItems(cursor);
	var exportFields = ["cat"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ShopCatsView.rendered = function() {
	pageSession.set("ShopCatsViewStyle", "table");
	
};

Template.ShopCatsView.events({
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
				pageSession.set("ShopCatsViewSearchString", searchString);
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
					pageSession.set("ShopCatsViewSearchString", searchString);
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
					pageSession.set("ShopCatsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("shop.cats.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ShopCatsViewExport(this.cat_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ShopCatsViewExport(this.cat_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ShopCatsViewExport(this.cat_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ShopCatsViewExport(this.cat_list, "json");
	}

	
});

Template.ShopCatsView.helpers({

	"insertButtonClass": function() {
		return Cats.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.cat_list || this.cat_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.cat_list && this.cat_list.count() > 0;
	},
	"isNotFound": function() {
		return this.cat_list && pageSession.get("ShopCatsViewSearchString") && ShopCatsViewItems(this.cat_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ShopCatsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ShopCatsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ShopCatsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ShopCatsViewStyle") == "gallery";
	}

	
});


Template.ShopCatsViewTable.rendered = function() {
	
};

Template.ShopCatsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ShopCatsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ShopCatsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ShopCatsViewSortAscending") || false;
			pageSession.set("ShopCatsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ShopCatsViewSortAscending", true);
		}
	}
});

Template.ShopCatsViewTable.helpers({
	"tableItems": function() {
		return ShopCatsViewItems(this.cat_list);
	}
});


Template.ShopCatsViewTableItems.rendered = function() {
	
};

Template.ShopCatsViewTableItems.events({
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

		Cats.update({ _id: this._id }, { $set: values });

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
						Cats.remove({ _id: me._id });
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
		Router.go("shop.cats.edit", {catId: this._id});
		return false;
	}
});

Template.ShopCatsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Cats.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Cats.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
