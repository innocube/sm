var pageSession = new ReactiveDict();

Template.OrderInvoicesEdit.rendered = function() {
	
};

Template.OrderInvoicesEdit.events({
	
});

Template.OrderInvoicesEdit.helpers({
	
});

Template.OrderInvoicesEditEditForm.rendered = function() {
	

	pageSession.set("orderInvoicesEditEditFormInfoMessage", "");
	pageSession.set("orderInvoicesEditEditFormErrorMessage", "");

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

Template.OrderInvoicesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderInvoicesEditEditFormInfoMessage", "");
		pageSession.set("orderInvoicesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderInvoicesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(orderInvoicesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderInvoicesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.invoices", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderInvoicesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Invoices.update({ _id: t.data.invoice_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.OrderInvoicesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderInvoicesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderInvoicesEditEditFormErrorMessage");
	}
	
});
