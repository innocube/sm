var pageSession = new ReactiveDict();

Template.ShopItemsEdit.rendered = function() {
	
};

Template.ShopItemsEdit.events({
	
});

Template.ShopItemsEdit.helpers({
	
});

Template.ShopItemsEditEditForm.rendered = function() {
	

	pageSession.set("shopItemsEditEditFormInfoMessage", "");
	pageSession.set("shopItemsEditEditFormErrorMessage", "");

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

Template.ShopItemsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("shopItemsEditEditFormInfoMessage", "");
		pageSession.set("shopItemsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var shopItemsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(shopItemsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("shopItemsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("shop.items", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("shopItemsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Items.update({ _id: t.data.item_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("shop.items", {});
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

Template.ShopItemsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("shopItemsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("shopItemsEditEditFormErrorMessage");
	}
	
});
