var pageSession = new ReactiveDict();

Template.OrderDeliveryEdit.rendered = function() {
	
};

Template.OrderDeliveryEdit.events({
	
});

Template.OrderDeliveryEdit.helpers({
	
});

Template.OrderDeliveryEditEditForm.rendered = function() {
	

	pageSession.set("orderDeliveryEditEditFormInfoMessage", "");
	pageSession.set("orderDeliveryEditEditFormErrorMessage", "");

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

Template.OrderDeliveryEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("orderDeliveryEditEditFormInfoMessage", "");
		pageSession.set("orderDeliveryEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var orderDeliveryEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(orderDeliveryEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("orderDeliveryEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("order.delivery", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("orderDeliveryEditEditFormErrorMessage", message);
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

		

		Router.go("order.delivery", {});
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

Template.OrderDeliveryEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("orderDeliveryEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("orderDeliveryEditEditFormErrorMessage");
	}
	
});
