var pageSession = new ReactiveDict();

Template.OrderFinanceDetailsEdit.rendered = function() {
	
};

Template.OrderFinanceDetailsEdit.events({
	
});

Template.OrderFinanceDetailsEdit.helpers({
	
});

Template.OrderFinanceDetailsEditEditForm.rendered = function() {
	

	pageSession.set("orderFinanceDetailsEditEditFormInfoMessage", "");
	pageSession.set("orderFinanceDetailsEditEditFormErrorMessage", "");

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

Template.OrderFinanceDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderFinanceDetailsEditEditFormInfoMessage", "");
		pageSession.set("orderFinanceDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderFinanceDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(orderFinanceDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderFinanceDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.finance.details", {invoiceId: self.params.invoiceId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderFinanceDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Payments.update({ _id: t.data.payment_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.OrderFinanceDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderFinanceDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderFinanceDetailsEditEditFormErrorMessage");
	}
	
});
