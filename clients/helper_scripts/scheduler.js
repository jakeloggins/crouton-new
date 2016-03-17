var jsonfile = require('jsonfile'),
	later = require('later'),
	util = require('util'), // not sure if I need this
	fs = require('fs');

var mqtt = require('mqtt'),
	mqtt_config = require('./mqtt_broker_config.json'),
	client = mqtt.connect(mqtt_config);

// where schedules are stored and accessed on reconnect
var file = 'data.json';

// comprehensive object containing all schedules and later.setInterval functions for clearing
var active = {};

function startup() {
	try {
		// does file exist
		fs.accessSync(file, fs.R_OK | fs.W_OK);

		stored = require('./data.json');

		// place stored schedules in active and rebuild later setIntervals
		for (var key in stored){
			active[key] = {}; // append endpoint but don't erase other endpoints

			for (endpoint in stored[key]) {
				console.log(endpoint);
				// get everything but interval from stored
				var schedule = stored[key][endpoint]["schedule"],
					action = stored[key][endpoint]["action"],
					path = stored[key][endpoint]["path"],
					device_name = key,
					value = stored[key][endpoint]["value"];

				active[key][endpoint] = {
					"interval": later.setInterval(sendMSG.bind(null, action, path, device_name, endpoint, value), schedule),
					"schedule": schedule,
					"action": action,
					"path": path,
					"value": value,
				};
			};
		};
	}
	catch(error) {
		// file does not exist so write empty file
		jsonfile.writeFile(file, active, {spaces: 2});
	}

	console.log(active);
		
};

function onMSG(topic, payload) {

	// only process if there's a valid action in the path
	action_match = topic.match(/toggle|button|slide_to|slide_above|slide_below/);
	if (action_match != null) {

		// parse topic for path, device_name, endPoint, action, and value from message topic
		// topic format: /schedule/[path]/[action]/[device_name]/[endPoint]/[value]
		// topic = "/schedule/house/upstairs/guest/toggle/pi/nightlight/off";	
		action = topic.toString().match(/toggle|button|slide_to|slide_above|slide_below/).toString();

		parse_action = topic.toString().split(/toggle|button|slide_to|slide_above|slide_below/);
		before_action = parse_action[0].toString().split("/").filter(Boolean);
		after_action = parse_action[1].toString().split("/").filter(Boolean);

		// parse payload from raw text or completed schedule object
		if (payload.charAt(0) == "{") {
			schedule = payload;
		}
		else {
			schedule = later.parse.text(payload);
			console.log(JSON.stringify(schedule));
		}

		// create variables
		path = parse_action[0].toString().split("/schedule").filter(Boolean).toString();
		device_name = after_action[0].toString();
		endpoint = after_action[1].toString();
		if (action == "button") {
			value = "";
		} else {
			value = after_action[2].toString();
		}


		// create key from endpoint and device_name
		//new_key = device_name.concat("_").concat(endpoint);

		// check to see if key already exists, if so, clear it's setInterval
		for (key in active) {
			if (key == device_name) {
				for (old_endpoint in active[key]) {
					if (old_endpoint == endpoint) {
						console.log("match found, clearing first");
						active[key][endpoint].interval.clear();
					}
				};
			}
			else {
				// to make sure append to active works, but is not an overwrite
				active[device_name] = {};
			}
		};

		// append to active
		active[device_name][endpoint] = {
			"interval": later.setInterval(sendMSG.bind(null, action, path, device_name, endpoint, value), schedule),
			"schedule": schedule,
			"action": action,
			"path": path,
			"value": value,
		};

		//write all of active into JSON file
		jsonfile.writeFile(file, active, {spaces: 2});
	}
}


function sendMSG(action, path, device_name, endpoint, value) {
	// note: path will have enclosing slashes already included
    send_topic = path.concat("control/").concat(device_name).concat("/").concat(endpoint);
	payload_obj = {};

	switch(action) {
    
	    case "toggle":
			// value can only be true or false
			if (value == "on") {
				payload_obj.value = true;
			}
			else {
				payload_obj.value = false;
			}
			// -- complex way (for global schedule commands later: 
				// get device_name, endpoint, path from stored JSON active device list
				// if card type is a slider, message payload should be value: 0
				// if card type is toggle, message payload should be false
	        break;

	    case "button":
			// button action
			payload_obj.value = true;
	        break;

	    case "slide_to":
			// slide_to(path, device_name, endpoint, value)
			payload_obj.value = value;
	        break;

	    case "slide_above":
			// --slide_above(path, device_name, endpoint, value)
				// -- complex way:
					// get last known value from JSON active device list
					// if current value is already above the desired [value], 
						// do nothing
					// if current value is below the desired [value], 
						// send value: [value] in msg payload
	        break;

	    case "slide_below":
			// --slide below(path, device_name, endpoint, value)
				// -- complex way:
					// get last known value from JSON active device list
					// if current value is already above the desired [value], 
						// send value: [value] in msg payload
					// if current value is below the desired [value], 
						// do nothing
	        break;

	} 

	send_payload = JSON.stringify(payload_obj);

	client.publish(send_topic, JSON.stringify(payload_obj));

};


// start program
startup();

client.on('connect', function () {
  client.subscribe('/schedule/#');
  client.publish('/schedule/', 'node scheduler connected');
  console.log("node scheduler connected");
});

//client.on('message', onMSG(topic, message));

client.on('message', function (topic, payload) {
	onMSG(topic, payload.toString());
});








