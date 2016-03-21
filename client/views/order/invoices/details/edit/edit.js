var pageSession = new ReactiveDict();

Template.OrderInvoicesDetailsEdit.rendered = function() {
	
};

Template.OrderInvoicesDetailsEdit.events({
	
});

Template.OrderInvoicesDetailsEdit.helpers({
	
});

Template.OrderInvoicesDetailsEditEditForm.rendered = function() {
	

	pageSession.set("orderInvoicesDetailsEditEditFormInfoMessage", "");
	pageSession.set("orderInvoicesDetailsEditEditFormErrorMessage", "");

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

Template.OrderInvoicesDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderInvoicesDetailsEditEditFormInfoMessage", "");
		pageSession.set("orderInvoicesDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderInvoicesDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(orderInvoicesDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderInvoicesDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.invoices.details", {invoiceId: self.params.invoiceId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderInvoicesDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				InvoiceItems.update({ _id: t.data.invoice_item._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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
		e.preventDefault();
		var cat_id = $(e.target).val();
		pageSession.set("cat_id", cat_id);
		//console.log(">> CAT ID: [ " + pageSession.get("cat_id") + " ] has been set on selection of Category..");
	},
	"change input": function(e, t) {
		e.preventDefault();
		var item_id = e.currentTarget.value;
		pageSession.set("item_id", item_id);
		//console.log(">> ITEM ID: [ " + pageSession.get("item_id") + " ] has been set on selection of Item [Radio]..");
	}
	
});

Template.OrderInvoicesDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderInvoicesDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderInvoicesDetailsEditEditFormErrorMessage");
	},
	"cat_list": function() {
		return Cats.find({}, { sort: { cat: 1 } });
	},
	"item_list": function() {
		var cat_id = pageSession.get("cat_id");
		if (cat_id == undefined) {
			var addr = location.href.split('/');
			var inv_item_id = addr.pop();
			InvoiceItems.find({_id: inv_item_id}).map(function (ii) {
				cat_id = ii.catId;
			});
			//console.log(">> Getting Item List with CAT ID of [ " + cat_id + " ] from URL");
		}
		return Items.find({catId: cat_id}, { sort: { description: 1 } });
	},
	"getPrice": function() {
		var price = 0;
		var item_id = pageSession.get("item_id");
		//console.log("ITEM ID from Session: " + item_id + " in getPrice");
		if (item_id == undefined) {
			var addr = location.href.split('/');
			var inv_item_id = addr.pop();
			InvoiceItems.find({_id: inv_item_id}).map(function (ii) {
				price = ii.price;
			});
		} else {
			var item = Items.findOne({_id: item_id});
			price = item.price;
		}
		return price;
	}

});
