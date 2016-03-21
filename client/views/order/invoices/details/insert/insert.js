var pageSession = new ReactiveDict();

Template.OrderInvoicesDetailsInsert.rendered = function() {
	
};

Template.OrderInvoicesDetailsInsert.events({
	
});

Template.OrderInvoicesDetailsInsert.helpers({
	
});

Template.OrderInvoicesDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("orderInvoicesDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("orderInvoicesDetailsInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.OrderInvoicesDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderInvoicesDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("orderInvoicesDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderInvoicesDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(orderInvoicesDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderInvoicesDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.invoices.details", {invoiceId: self.params.invoiceId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderInvoicesDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.invoiceId = self.params.invoiceId;

				newId = InvoiceItems.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("order.invoices.details", {invoiceId: this.params.invoiceId});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	},
	"change select[name='catId']": function(e, t) {
		var cat_id = $(e.target).val();
		pageSession.set("cat_id", cat_id);
		//console.log(pageSession.get("cat_id"));
	},
	"change input[name='itemId']": function(e, t) {
		var item_id = $(e.target).val();
		pageSession.set("item_id", item_id);
		//console.log(pageSession.get("item_id"));
	}
	
});

Template.OrderInvoicesDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderInvoicesDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderInvoicesDetailsInsertInsertFormErrorMessage");
	}, 
	"getPrice": function(doc) { var price = 0; var item_id = pageSession.get("item_id"); if (!item_id) { return price; } else { var item = Items.findOne({_id: item_id}); price = item.price; return price; } },
	"cat_list": function() {
		return Cats.find({}, { sort: { cat: 1 } });
	},
	"item_list": function() {
		var cat_id = pageSession.get("cat_id");
		return Items.find({catId: cat_id}, { sort: { description: 1 } });
	},
	"prevClass": function() {
		var cat_id = pageSession.get("cat_id");
		//console.log(">>> current id: " + this._id);
		if (cat_id == this._id) return "selected";
	}

});
