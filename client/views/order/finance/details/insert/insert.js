var pageSession = new ReactiveDict();

Template.OrderFinanceDetailsInsert.rendered = function() {
	
};

Template.OrderFinanceDetailsInsert.events({
	
});

Template.OrderFinanceDetailsInsert.helpers({
	
});

Template.OrderFinanceDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("orderFinanceDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("orderFinanceDetailsInsertInsertFormErrorMessage", "");

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

Template.OrderFinanceDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderFinanceDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("orderFinanceDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderFinanceDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(orderFinanceDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderFinanceDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.finance.details", {invoiceId: self.params.invoiceId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderFinanceDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.invoiceId = self.params.invoiceId;

				newId = Payments.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("order.finance.details", {invoiceId: this.params.invoiceId});
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

Template.OrderFinanceDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderFinanceDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderFinanceDetailsInsertInsertFormErrorMessage");
	}
	
});
