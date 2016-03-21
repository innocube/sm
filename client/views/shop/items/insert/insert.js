var pageSession = new ReactiveDict();

Template.ShopItemsInsert.rendered = function() {
	
};

Template.ShopItemsInsert.events({
	
});

Template.ShopItemsInsert.helpers({
	
});

Template.ShopItemsInsertInsertForm.rendered = function() {
	

	pageSession.set("shopItemsInsertInsertFormInfoMessage", "");
	pageSession.set("shopItemsInsertInsertFormErrorMessage", "");

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

Template.ShopItemsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("shopItemsInsertInsertFormInfoMessage", "");
		pageSession.set("shopItemsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var shopItemsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(shopItemsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("shopItemsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("shop.items", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("shopItemsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Items.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ShopItemsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("shopItemsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("shopItemsInsertInsertFormErrorMessage");
	}
	
});
