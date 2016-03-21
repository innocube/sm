var pageSession = new ReactiveDict();

Template.OrderCustomersDetails.rendered = function() {
	
};

Template.OrderCustomersDetails.events({
	
});

Template.OrderCustomersDetails.helpers({
	
});

Template.OrderCustomersDetailsDetailsForm.rendered = function() {
	

	pageSession.set("orderCustomersDetailsDetailsFormInfoMessage", "");
	pageSession.set("orderCustomersDetailsDetailsFormErrorMessage", "");

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

Template.OrderCustomersDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderCustomersDetailsDetailsFormInfoMessage", "");
		pageSession.set("orderCustomersDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderCustomersDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(orderCustomersDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderCustomersDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderCustomersDetailsDetailsFormErrorMessage", message);
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

		Router.go("order.customers", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("order.customers", {});
	}

	
});

Template.OrderCustomersDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderCustomersDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderCustomersDetailsDetailsFormErrorMessage");
	}
	
});
