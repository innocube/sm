// Items
Items.join(Cats, "catId", "cats", ["cat"]);

// Invoices
Invoices.join(Customers, "customerId", "customer", ["name"]);
Invoices.join(Reps, "orderedBy", "", ["_id"]);

// InvoiceItems
InvoiceItems.join(Cats, "catId", "cats", ["cat"]);
InvoiceItems.join(Items, "itemId", "item", ["description", "price"]);

