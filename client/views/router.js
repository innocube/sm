Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = [
	"home_public",
	"login",
	"register",
	"forgot_password",
	"reset_password"
];

var privateRoutes = [
	"home_private",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
	"admin.db_manage",
	"order",
	"order.invoices",
	"order.invoices.insert",
	"order.invoices.details",
	"order.invoices.details.invoice_items",
	"order.invoices.details.insert",
	"order.invoices.details.edit",
	"order.invoices.edit",
	"order.finance",
	"order.finance.details",
	"order.finance.details.payments",
	"order.finance.details.insert",
	"order.finance.details.edit",
	"order.delivery",
	"order.delivery.edit",
	"order.customers",
	"order.customers.insert",
	"order.customers.details",
	"order.customers.edit",
	"shop",
	"shop.cats",
	"shop.cats.insert",
	"shop.cats.edit",
	"shop.items",
	"shop.items.insert",
	"shop.items.details",
	"shop.items.edit",
	"shop.reps",
	"shop.reps.insert",
	"shop.reps.details",
	"shop.reps.edit",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

var freeRoutes = [
	
];

var roleMap = [
	{ route: "admin",	roles: ["admin"] },
	{ route: "admin.users",	roles: ["admin"] },
	{ route: "admin.users.details",	roles: ["admin"] },
	{ route: "admin.users.insert",	roles: ["admin"] },
	{ route: "admin.users.edit",	roles: ["admin"] },
	{ route: "admin.db_manage",	roles: ["admin"] },
	{ route: "order",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.insert",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.details",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.details.invoice_items",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.details.insert",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.details.edit",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.invoices.edit",	roles: ["admin","manager","s_manager","factory","user","salesman"] },
	{ route: "order.finance",	roles: ["admin","manager"] },
	{ route: "order.finance.details",	roles: ["admin","manager"] },
	{ route: "order.finance.details.payments",	roles: ["admin","manager"] },
	{ route: "order.finance.details.insert",	roles: ["admin","manager"] },
	{ route: "order.finance.details.edit",	roles: ["admin","manager"] },
	{ route: "order.delivery",	roles: ["admin","manager","s_manager","factory"] },
	{ route: "order.delivery.edit",	roles: ["admin","manager","s_manager","factory"] },
	{ route: "order.customers",	roles: ["admin","manager","s_manager","salesman"] },
	{ route: "order.customers.insert",	roles: ["admin","manager","s_manager","salesman"] },
	{ route: "order.customers.details",	roles: ["admin","manager","s_manager","salesman"] },
	{ route: "order.customers.edit",	roles: ["admin","manager","s_manager","salesman"] },
	{ route: "shop",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.cats",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.cats.insert",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.cats.edit",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.items",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.items.insert",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.items.details",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.items.edit",	roles: ["admin","manager","factory","user"] },
	{ route: "shop.reps",	roles: ["admin","manager","s_manager","factory","user"] },
	{ route: "shop.reps.insert",	roles: ["admin"] },
	{ route: "shop.reps.details",	roles: ["admin","manager","s_manager","factory","user"] },
	{ route: "shop.reps.edit",	roles: ["admin","manager","s_manager","factory","user"] }
];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		var redirectRoute = firstGrantedRoute("home_public");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = firstGrantedRoute("home_private");
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute("home_private");
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Router.waitOn(function() { 
	Meteor.subscribe("current_user_data");
});

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		this.render('loading');
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController"});
	this.route("admin", {path: "/admin", controller: "AdminController"});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController"});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController"});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController"});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController"});
	this.route("admin.db_manage", {path: "/admin/db_manage", controller: "AdminDbManageController"});
	this.route("order", {path: "/order", controller: "OrderController"});
	this.route("order.invoices", {path: "/order/invoices", controller: "OrderInvoicesController"});
	this.route("order.invoices.insert", {path: "/order/invoices/insert", controller: "OrderInvoicesInsertController"});
	this.route("order.invoices.details", {path: "/order/invoices/details/:invoiceId", controller: "OrderInvoicesDetailsController"});
	this.route("order.invoices.details.invoice_items", {path: "/order/invoices/details/:invoiceId/invoice_items", controller: "OrderInvoicesDetailsInvoiceItemsController"});
	this.route("order.invoices.details.insert", {path: "/order/invoices/details/:invoiceId/insert", controller: "OrderInvoicesDetailsInsertController"});
	this.route("order.invoices.details.edit", {path: "/order/invoices/details/:invoiceId/edit/:itemId", controller: "OrderInvoicesDetailsEditController"});
	this.route("order.invoices.edit", {path: "/order/invoices/edit/:invoiceId", controller: "OrderInvoicesEditController"});
	this.route("order.finance", {path: "/order/finance", controller: "OrderFinanceController"});
	this.route("order.finance.details", {path: "/order/finance/details/:invoiceId", controller: "OrderFinanceDetailsController"});
	this.route("order.finance.details.payments", {path: "/order/finance/details/:invoiceId/payments", controller: "OrderFinanceDetailsPaymentsController"});
	this.route("order.finance.details.insert", {path: "/order/finance/details/:invoiceId/insert", controller: "OrderFinanceDetailsInsertController"});
	this.route("order.finance.details.edit", {path: "/order/finance/details/:invoiceId/edit/:paymentId", controller: "OrderFinanceDetailsEditController"});
	this.route("order.delivery", {path: "/order/delivery", controller: "OrderDeliveryController"});
	this.route("order.delivery.edit", {path: "/order/delivery/edit/:invoiceId", controller: "OrderDeliveryEditController"});
	this.route("order.customers", {path: "/order/customers", controller: "OrderCustomersController"});
	this.route("order.customers.insert", {path: "/order/customers/insert", controller: "OrderCustomersInsertController"});
	this.route("order.customers.details", {path: "/order/customers/details/:customerId", controller: "OrderCustomersDetailsController"});
	this.route("order.customers.edit", {path: "/order/customers/edit/:customerId", controller: "OrderCustomersEditController"});
	this.route("shop", {path: "/shop", controller: "ShopController"});
	this.route("shop.cats", {path: "/shop/cats", controller: "ShopCatsController"});
	this.route("shop.cats.insert", {path: "/shop/cats/insert", controller: "ShopCatsInsertController"});
	this.route("shop.cats.edit", {path: "/shop/cats/edit/:catId", controller: "ShopCatsEditController"});
	this.route("shop.items", {path: "/shop/items", controller: "ShopItemsController"});
	this.route("shop.items.insert", {path: "/shop/items/insert", controller: "ShopItemsInsertController"});
	this.route("shop.items.details", {path: "/shop/items/details/:itemId", controller: "ShopItemsDetailsController"});
	this.route("shop.items.edit", {path: "/shop/items/edit/:itemId", controller: "ShopItemsEditController"});
	this.route("shop.reps", {path: "/shop/reps", controller: "ShopRepsController"});
	this.route("shop.reps.insert", {path: "/shop/reps/insert", controller: "ShopRepsInsertController"});
	this.route("shop.reps.details", {path: "/shop/reps/details/:repId", controller: "ShopRepsDetailsController"});
	this.route("shop.reps.edit", {path: "/shop/reps/edit/:repId", controller: "ShopRepsEditController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
