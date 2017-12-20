	
frappe.views.calendar["Appointment"] = {
	field_map: {
		"start": "starts_on",
		"end": "ends_on",
		"id": "name",
		"allDay": "all_day",
		"title": "customer",
		"status": "status",
		"employee":"employee"
	},

	style_map: {
		"Open": "open",
		"Confirm": "confirm",
		"Cancel": "cancel",
		"Completed":"completed"
	},
	styles: {
		"open": {
			"color": "#2E64FE"
		},
		"confirm": {
			"color": "#F7FE2E"
		},
		"cancel": {
			"color": "#FE2E2E"
		},
		"completed": {
			"color": "#04B404"
		}
	},
	gantt: true,
	gantt_scale: "hours",
	filters: [
		{
			"fieldtype": "Link",
			"fieldname": "employee",
			"options": "Employee",
			"label": __("Employee")
		},
	],
	get_events_method: "appointment.appointment_manager.doctype.appointment.appointment.get_events"
}
