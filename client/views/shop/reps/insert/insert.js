var pageSession = new ReactiveDict();

Template.ShopRepsInsert.rendered = function() {
	
};

Template.ShopRepsInsert.events({
	
});

Template.ShopRepsInsert.helpers({
	
});

Template.ShopRepsInsertInsertForm.rendered = function() {
	

	pageSession.set("shopRepsInsertInsertFormInfoMessage", "");
	pageSession.set("shopRepsInsertInsertFormErrorMessage", "");

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

Template.ShopRepsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("shopRepsInsertInsertFormInfoMessage", "");
		pageSession.set("shopRepsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var shopRepsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(shopRepsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("shopRepsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("shop.reps", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("shopRepsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Reps.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("shop.reps", {});
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

Template.ShopRepsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("shopRepsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("shopRepsInsertInsertFormErrorMessage");
	}
	
});
