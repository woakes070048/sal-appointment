
frappe.ui.form.on("Appointment", "validate", function(frm,doc) {
	var start_dates =[];
	var end_dates =[];
	for (var i in frm.doc.service){
		var service = frm.doc.service[i];
		start_dates.push(new Date(service.starts_on));
		end_dates.push(new Date(service.ends_on));
	}
	//console.log(dates);
	var maxDate=new Date(Math.max.apply(null,end_dates));
	var minDate=new Date(Math.min.apply(null,start_dates));
	frm.doc.starts_on = minDate;
	frm.refresh_field("starts_on");
	frm.doc.ends_on = maxDate;
	frm.refresh_field("ends_on");


    if(frm.doc.starts_on && frm.doc.ends_on){
		if(frm.doc.starts_on >frm.doc.ends_on){
			msgprint(__("Start Time should be greater than End Time"));
			validated = false;
		}
	}

});

// frappe.ui.form.on("Appointment", "starts_on", function(frm,doc) {
//     if(frm.doc.starts_on){
// 		frm.doc.starts = frm.doc.starts_on 
// 	}
// });
	// frappe.ui.form.on('Appointment', {
	// setup: function(frm){
	// 	frm.custom_make_buttons = {
	// 		'Delivery Note': 'Delivery',
	// 		'Sales Invoice': 'Sales Return',
	// 		'Payment Request': 'Payment Request',
	// 		'Payment Entry': 'Payment'
	// 	}
	// 	}
	
	// });




frappe.ui.form.on("Appointment", "refresh", function(frm,doc) {

    if((frm.doc.status=='Cancel') || (frm.doc.status=='Completed')){
    	// cur_frm.set_value('starts_on','');
    	// cur_frm.set_value('ends_on','');
		cur_frm.set_df_property('customer', 'read_only', 1);
		cur_frm.set_df_property('starts_on', 'read_only', 1);
		cur_frm.set_df_property('ends_on', 'read_only', 1);
		cur_frm.set_df_property('employee', 'read_only', 1);
		cur_frm.set_df_property('company', 'read_only', 1);
		cur_frm.set_df_property('service', 'read_only', 1);
		cur_frm.set_df_property('status', 'read_only', 1);
		cur_frm.set_df_property('appointment_type', 'read_only', 1);
		refresh_field("customer")
		refresh_field("starts_on")
		refresh_field("ends_on")
		refresh_field("employee")
		refresh_field("company")
		refresh_field("service")
		refresh_field("status")
		refresh_field("appointment_type")
	}
	if(frm.doc.status == "Confirm"){
			frm.add_custom_button(__('GO TO POS'), function() {
				frappe.set_route("point-of-sale");	
			});
	}

});


frappe.ui.form.on('Service Items', {
	refresh: function(frm) {

	},

	starts_on: function(doc, cdt, cdn){
		var d = locals[cdt][cdn];
		console.log("called");
		console.log(d.item);
		if(!d.item){
			console.log("no item");
			msgprint("enter item");
		}
		else{
			var duration = frappe.model.get_value("Item",d.item, duration);
			console.log(duration);
		
			frappe.call({
			method: "appointment.appointment_manager.doctype.appointment.appointment.get_item_duration",
			args: {
				"item": d.item,
				"starts_on": d.starts_on
			},
			callback: function(r) {
				if(r.message) {
					console.log("item duration");
					date = frappe.datetime.now_time();
					console.log(date);
					console.log(d.name);

					d.ends_on = r.message;
					
					frappe.refresh_field(d.ends_on);


					// cur_frm.set_value("ends_on", frappe.datetime.now_time());
					frappe.model.set_value(cdn,cdt ,"ends_on",date);
					
					// console.log(r.message);
					}

				}
			});
		}
	},

	ends_on: function(doc, cdt, cdn){
		var d = locals[cdt][cdn];
		if(d.starts_on >d.ends_on){
			msgprint(__("Start Time should be greater than End Time"));
			validated = false;
		}
	}

});

// cur_frm.fields_dict.customer.get_query = function(doc) {
// 	return {
// 		query: "appointment.appointment_manager.doctype.appointment.appointment.get_mob_no"
// 	}
// }

// frappe.ui.form.on("Appointment", "customer", function(frm,doc) {
//     frappe.call({
// 		method: "appointment.appointment_manager.doctype.appointment.appointment.get_customer_mobile",
// 		args: {
// 			"customer": frm.doc.customer
// 		},
// 		callback: function(r) {
// 			if(r.message) {
// 				if (frm.doc.appointment_type=='Home Service'){
// 					frm.doc.customer_mobile_no = r.message[0][0]
// 					refresh_field("customer_mobile_no")
// 				}
// 				else{
// 					frm.doc.customer_mobile_no = ''
// 					refresh_field("customer_mobile_no")
// 				}
// 			}
// 			else{
// 				frm.doc.customer_mobile_no = ''
// 				refresh_field("customer_mobile_no")
// 			}
// 		}
// 	});

// 	frappe.call({
// 		method: "appointment.appointment_manager.doctype.appointment.appointment.get_address",
// 		args: {
// 			"customer": frm.doc.customer
// 		},
// 		callback: function(r) {
// 			if(r.message) {
// 				if (frm.doc.appointment_type=='Home Service'){
// 					frm.doc.address_display = r.message
// 					refresh_field("address_display")
// 				}
// 				else{
// 					frm.doc.address_display = ''
// 					refresh_field("address_display")
// 				}
// 			}
// 			else{
// 				frm.doc.address_display = ''
// 				refresh_field("address_display")
// 			}
// 		}
// 	});
// });

frappe.ui.form.on("Appointment", "appointment_type", function(frm,doc) {
    frappe.call({
		method: "appointment.appointment_manager.doctype.appointment.appointment.get_customer_mobile",
		args: {
			"customer": frm.doc.customer
		},
		callback: function(r) {
			if(r.message) {
				if (frm.doc.appointment_type=='Home Service'){
					frm.doc.customer_mobile_no = r.message[0][0]
					refresh_field("customer_mobile_no")
				}
				else{
					frm.doc.customer_mobile_no = ''
					refresh_field("customer_mobile_no")
				}
			}
		}
	});

	frappe.call({
		method: "appointment.appointment_manager.doctype.appointment.appointment.get_address",
		args: {
			"customer": frm.doc.customer
		},
		callback: function(r) {
			if(r.message) {
				if (frm.doc.appointment_type=='Home Service'){
					frm.doc.address_display = r.message
					refresh_field("address_display")
				}
				else{
					frm.doc.address_display = ''
					refresh_field("address_display")
				}
			}
		}
	});
});
