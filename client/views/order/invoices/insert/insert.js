var pageSession = new ReactiveDict();

Template.OrderInvoicesInsert.rendered = function() {
	
};

Template.OrderInvoicesInsert.events({
	
});

Template.OrderInvoicesInsert.helpers({
	
});

Template.OrderInvoicesInsertInsertForm.rendered = function() {
	

	pageSession.set("orderInvoicesInsertInsertFormInfoMessage", "");
	pageSession.set("orderInvoicesInsertInsertFormErrorMessage", "");

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

Template.OrderInvoicesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderInvoicesInsertInsertFormInfoMessage", "");
		pageSession.set("orderInvoicesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderInvoicesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(orderInvoicesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderInvoicesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.invoices.details", {invoiceId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderInvoicesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Invoices.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("order.invoices", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.OrderInvoicesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderInvoicesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderInvoicesInsertInsertFormErrorMessage");
	},
	"customer_list": function() {
		var user = Users.findOne();
		//console.log("User id: " + user._id);
		if (user.roles == "salesman") {
			return Customers.find({ownerId: user._id}, {sort: { name: 1 } });
		} else {
			return Customers.find({}, {sort: { name: 1 } });
		}
	}

});
