// jsonfile does not append. rewrites all of the JSON into document each time.
var jsonfile = require('jsonfile');
var later = require('later');
var util = require('util');
var fs = require('fs');

// where schedules are stored and accessed on reconnect
var file = 'data.json';

// comprehensive object containing all schedules and later.setInterval functions for clearing
var active = {};

// debug stuff
var count = 10;
var sched_one = later.parse.recur().every(5).second();
var sched_five = later.parse.recur().every(10).second();

// extreme psuedo code
	// on startup, check for the file and rebuild the t object from the stored schedules
		// if no file, set marker so first time onmsg is called, it gets created

	// grab message and parse
	// append to JSON file
		// name_and_endpoint form device key
		// function call goes into interval
		// schedule object goes into schedule

	// need a clear function to clear and delete entry from schedule

function startup() {
	try {
		// does file exist
		fs.accessSync(file, fs.R_OK | fs.W_OK);

		// read stored schedules
		stored = jsonfile.readFileSync(file);

		// place stored schedules in active and fire off later setIntervals
		for (var key in stored){
			//console.log(r[key]["schedule"]);
			active[key] = {
				"interval": later.setInterval(test.bind(null,key), stored[key]["schedule"]),
				"schedule": stored[key]["schedule"],
			};
		};
	}
	catch(error) {
		// file does not exist so write empty file
		jsonfile.writeFile(file, active, {spaces: 2});
	}
		
};

function sendMSG(path, device_name, endpoint, value, action) {
	// usage example
		// active[key]["interval"] = later.setInterval(sendMSG.bind(null, path, device_name, endpoint, value, action), active[key]["schedule"]);
	
	// toggle(path, device_name, endpoint, value)
	
	// value can only be off or on

	// simple way:
		// send message to
			// topic: [path]/control/[device_name]/[endPoint]
			// payload value: true/false

	// -- complex way (for global schedule commands later: 
		// get device_name, endpoint, path from stored JSON active device list
		// if card type is a slider, message payload should be value: 0
		// if card type is toggle, message payload should be false

	// button action
		// same as above, but always send value: true

	// slide_to(path, device_name, endpoint, value)
		// format topic the same way as toggle

		// format payload as value: [value]

	// slide_above(path, device_name, endpoint, value)
		// -- complex way:
			// get last known value from JSON active device list
			// if current value is already above the desired [value], 
				// do nothing
			// if current value is below the desired [value], 
				// send value: [value] in msg payload

	// slide below(path, device_name, endpoint, value)
		// -- complex way:
			// get last known value from JSON active device list
			// if current value is already above the desired [value], 
				// send value: [value] in msg payload
			// if current value is below the desired [value], 
				// do nothing


};



// start program
startup();


// debug crap
var mode = "write";

if (mode == "write") {
	// data to be written
	id = "ones";
	active[id] = {
		"interval": later.setInterval(test.bind(null, id), sched_one),
		"schedule": sched_one,
	};

	id = "fives";
	active[id] = {
		"interval": later.setInterval(test.bind(null, id), sched_five),
		"schedule": sched_five,
	};
	
	// write to file
	jsonfile.writeFile(file, active, {spaces: 2});
};


// startup already does everything for you
if (mode == "read") {

	// do nothing

};



// counting function to test ability to clear active later.setIntervals
function test(uid) {
	console.log("test...")
	console.log(uid);
	console.log(new Date());
	count--;
	if(count <= 0) {
		console.log(active);
		active[uid].interval.clear();
	}
};






// --

// toggle(path, device_name, endpoint, value)
	
	// value can only be off or on

	// simple way:
		// send message to
			// topic: [path]/control/[device_name]/[endPoint]
			// payload value: true/false

	// -- complex way (for global schedule commands later: 
		// get device_name, endpoint, path from stored JSON active device list
		// if card type is a slider, message payload should be value: 0
		// if card type is toggle, message payload should be false

// button action
	// same as above, but always send value: true

// slide_to(path, device_name, endpoint, value)
	// format topic the same way as toggle

	// format payload as value: [value]

// slide_above(path, device_name, endpoint, value)
	// -- complex way:
		// get last known value from JSON active device list
		// if current value is already above the desired [value], 
			// do nothing
		// if current value is below the desired [value], 
			// send value: [value] in msg payload

// slide below(path, device_name, endpoint, value)
	// -- complex way:
		// get last known value from JSON active device list
		// if current value is already above the desired [value], 
			// send value: [value] in msg payload
		// if current value is below the desired [value], 
			// do nothing



// ---

// listen for MQTT message on /schedule/

// on message

	// parse for path, device_name, endPoint, action, and value from message topic
		// topic format: /schedule/[path]/[action]/[device_name]/[endPoint]/[value]

	// parse schedule from raw text or completed schedule object in message payload
		// schedule = later.parse


	// begin switch case

		// if action  == toggle
			// active[key]["interval"] = later.setInterval(toggle.bind(null, path, device_name, endpoint, value), active[key]["schedule"]);

		// if action == slide_to
			// active[key]["interval"] = later.setInterval(slide_to.bind(null, path, device_name, endpoint, value), active[key]["schedule"]);

		// if action == slide_above
			// active[key]["interval"] = later.setInterval(slide_above.bind(null, path, device_name, endpoint, value), active[key]["schedule"]);
		
		// if action == slide_below
			// active[key]["interval"] = later.setInterval(slide_below.bind(null, path, device_name, endpoint, value), active[key]["schedule"]);

		// if action == button
			// active[key]["interval"] = later.setInterval(button.bind(null, path, device_name, endpoint), active[key]["schedule"]);


// example:

// -t /schedule/house/upstairs/guestroom/toggle/crouton-demo/lamps/on -m "every weekday at 5pm"
// -t /schedule/house/upstairs/guestroom/toggle/crouton-demo/lamps/off -m "every weekday at 12am"

// scheduler would receive this message, parse the message text to generate a valid schedule and set later to send:
	// a "value: true" payload to the path /house/upstairs/guestroom/control/crouton-demo/lamps every weekday at 5pm
	// a "value: false" payload to the path /house/upstairs/guestroom/control/crouton-demo/lamps every weekday at 12am
