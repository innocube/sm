var pageSession = new ReactiveDict();

Template.OrderInvoicesDetails.rendered = function() {
	
};

Template.OrderInvoicesDetails.events({
	
});

Template.OrderInvoicesDetails.helpers({
	
});

Template.OrderInvoicesDetailsDetailsForm.rendered = function() {
	

	pageSession.set("orderInvoicesDetailsDetailsFormInfoMessage", "");
	pageSession.set("orderInvoicesDetailsDetailsFormErrorMessage", "");

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

Template.OrderInvoicesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderInvoicesDetailsDetailsFormInfoMessage", "");
		pageSession.set("orderInvoicesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderInvoicesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(orderInvoicesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderInvoicesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderInvoicesDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("order.invoices", {});
	}

	
});

Template.OrderInvoicesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderInvoicesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderInvoicesDetailsDetailsFormErrorMessage");
	}
	
});
