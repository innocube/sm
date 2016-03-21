var pageSession = new ReactiveDict();

Template.ShopCatsEdit.rendered = function() {
	
};

Template.ShopCatsEdit.events({
	
});

Template.ShopCatsEdit.helpers({
	
});

Template.ShopCatsEditEditForm.rendered = function() {
	

	pageSession.set("shopCatsEditEditFormInfoMessage", "");
	pageSession.set("shopCatsEditEditFormErrorMessage", "");

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

Template.ShopCatsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("shopCatsEditEditFormInfoMessage", "");
		pageSession.set("shopCatsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var shopCatsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(shopCatsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("shopCatsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("shop.cats", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("shopCatsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Cats.update({ _id: t.data.cat_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("shop.cats", {});
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

Template.ShopCatsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("shopCatsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("shopCatsEditEditFormErrorMessage");
	}
	
});
