var pageSession = new ReactiveDict();

Template.ShopReps.rendered = function() {
	
};

Template.ShopReps.events({
	
});

Template.ShopReps.helpers({
	
});

var ShopRepsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ShopRepsViewSearchString");
	var sortBy = pageSession.get("ShopRepsViewSortBy");
	var sortAscending = pageSession.get("ShopRepsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "totalAmount", "totalPaid", "note"];
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

var ShopRepsViewExport = function(cursor, fileType) {
	var data = ShopRepsViewItems(cursor);
	var exportFields = ["name", "phone", "email", "totalAmount", "totalPaid", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ShopRepsView.rendered = function() {
	pageSession.set("ShopRepsViewStyle", "table");
	
};

Template.ShopRepsView.events({
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
				pageSession.set("ShopRepsViewSearchString", searchString);
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
					pageSession.set("ShopRepsViewSearchString", searchString);
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
					pageSession.set("ShopRepsViewSearchString", "");
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
		ShopRepsViewExport(this.rep_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ShopRepsViewExport(this.rep_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ShopRepsViewExport(this.rep_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ShopRepsViewExport(this.rep_list, "json");
	}

	
});

Template.ShopRepsView.helpers({

	"insertButtonClass": function() {
		return Reps.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.rep_list || this.rep_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.rep_list && this.rep_list.count() > 0;
	},
	"isNotFound": function() {
		return this.rep_list && pageSession.get("ShopRepsViewSearchString") && ShopRepsViewItems(this.rep_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ShopRepsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ShopRepsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ShopRepsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ShopRepsViewStyle") == "gallery";
	}

	
});


Template.ShopRepsViewTable.rendered = function() {
	
};

Template.ShopRepsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ShopRepsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ShopRepsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ShopRepsViewSortAscending") || false;
			pageSession.set("ShopRepsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ShopRepsViewSortAscending", true);
		}
	}
});

Template.ShopRepsViewTable.helpers({
	"tableItems": function() {
		return ShopRepsViewItems(this.rep_list);
	}
});


Template.ShopRepsViewTableItems.rendered = function() {
	
};

Template.ShopRepsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("shop.reps.details", {repId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Reps.update({ _id: this._id }, { $set: values });

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
						Reps.remove({ _id: me._id });
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
		Router.go("shop.reps.edit", {repId: this._id});
		return false;
	}
});

Template.ShopRepsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Reps.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Reps.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
