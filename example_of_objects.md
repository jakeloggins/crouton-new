// initial config will produce this object and pass it to persistence, which stores it in the active_init_list
active init list:
{
  "16013813": {
	"current_ip": "192.168.1.141",
	"type": "esp",
    "espInfo": {
   		"chipID": "16013813",
		"board_type": "esp01_1m",
		"platform": "espressif",
		"flash_size": 1048576,
		"real_size": 1048576,
		"boot_version": 4
    }
  }
}


// uploader.js must take the above object from initial config and build the following JSON with provided user input
// adds following user input: upload sketch, name, path, endpoint names and values if card_display_choice is custom
// if card_display_choice is "default", it will grab "default_endpoints.json" file from the sketch folder and insert it

// uploader modifies the init_device_name def file in the sketch folder so that the esp knows its name on startup

upload example:
{
  "deviceInfo": {
	"current_ip": "192.168.1.141",
	"type": "esp",
    "espInfo": {
   		"chipID": "16013813",
		"board_type": "esp01_1m",
		"platform": "espressif",
		"flash_size": 1048576,
		"real_size": 1048576,
		"boot_version": 4,
    	"upload_sketch": "basic_esp8266",
    },
    "device_name": "Floodlight Monitor",
    "device_name_key": "floodlightMonitor",
    "device_status": "good",
    "path": "/backyard/floodlight/",
    "card_display_choice": "custom",
    "endPoints": {
      "lastTimeTriggered": {
        "title": "Last Time Triggered",
        "card-type": "crouton-simple-input",
        "static_endpoint_id": "time_input",
        "values": {
          "value": "n/a"
        }
      },
      "alertEmail": {
        "title": "Alert Email",
        "card-type": "crouton-simple-input",
        "static_endpoint_id": "alert_input",
        "values": {
          "value": "your_email_address@gmail.com"
        }
      }
    }
  }	
}

// if the upload is successful, the uploader will send the above JSON to deviceInfo/[name]/confirm so that it is stored


// persistence.js keeps track of all devices and states for persistence, uploading, deviceInfo, error messages, and helping arduino based devices
// it will add the device name as the key for each object in the list
all_devices object:
{
	"crouton-demo-new":{
		"deviceInfo":{
			"current_ip": "192.168.1.135",
			"type":"python script on pi",
			"device_status":"good",
			"device_name":"crouton-demo-new",
			"device_name_key": "crouton-demo-new",
			"description":"Kroobar's IOT devices",
			"color":"#4D90FE",
			"path":"/house/downstairs/office/test",
			"card_display_choice": "default",
			"endPoints":{
				"backDoorLock":{
				   "function":"toggle",
				   "card-type":"crouton-simple-toggle",
				   "title":"Employee Door",
				   "labels":{
				      "false":"Unlocked",
				      "true":"Locked"
				   },
				   "values":{
				      "value":false
				   },
				   "icons":{
				      "false":"lock",
				      "true":"lock"
				   }
				},
				"reset":{
				   "card-type":"crouton-simple-button",
				   "title":"Reset Cards",
				   "values":{
				      "value":true
				   },
				   "icons":{
				      "icon":"cutlery"
				   }
				},
				"barDoor":{
				   "units":"people entered",
				   "card-type":"crouton-simple-text",
				   "values":{
				      "value":73
				   },
				   "title":"Bar Main Door"
				},
				"temperature":{
				   "card-type":"crouton-chart-line",
				   "title":"Temperature (F)",
				   "max":11,
				   "high":73,
				   "values":{
				      "series":[
				         [
				            60
				         ]
				      ],
				      "labels":[
				         1
				      ]
				   },
				   "low":58
				},
				"barLightLevel":{
				   "card-type":"crouton-simple-slider",
				   "title":"Bar Light Brightness",
				   "max":100,
				   "min":0,
				   "values":{
				      "value":30
				   },
				   "units":"percent"
				},
				"discoLights":{
				   "max":255,
				   "card-type":"crouton-rgb-slider",
				   "title":"RGB Lights",
				   "values":{
				      "blue":0,
				      "green":0,
				      "red":0
				   },
				   "min":0
				},
				"customMessage":{
				   "card-type":"crouton-simple-input",
				   "values":{
				      "value":"Happy Hour is NOW!"
				   },
				   "title":"Billboard Message"
				},
				"occupancy":{
				   "card-type":"crouton-chart-donut",
				   "title":"Occupancy",
				   "values":{
				      "series":[
				         76
				      ],
				      "labels":[

				      ]
				   },
				   "centerSum":true,
				   "units":"%",
				   "total":100
				},
				"drinksOrdered":{
				   "card-type":"crouton-chart-donut",
				   "total":100,
				   "values":{
				      "series":[
				         10,
				         20,
				         30,
				         10,
				         30
				      ],
				      "labels":[
				         "Scotch",
				         "Shiner",
				         "Rum & Coke",
				         "Margarita",
				         "Other"
				      ]
				   },
				   "centerSum":false,
				   "title":"Drinks Ordered"
				},
				"lastCall":{
				   "card-type":"crouton-simple-button",
				   "title":"Last Call Bell",
				   "values":{
				      "value":true
				   },
				   "icons":{
				      "icon":"bell"
				   }
				},
				"danceLights":{
				   "function":"toggle",
				   "card-type":"crouton-simple-toggle",
				   "labels":{
				      "false":"OFF",
				      "true":"ON"
				   },
				   "values":{
				      "value":true
				   },
				   "title":"Dance Floor Lights"
				},
				"drinks":{
				   "units":"drinks",
				   "card-type":"crouton-simple-text",
				   "values":{
				      "value":83
				   },
				   "title":"Drinks Ordered"
				}
			}
		}
	},
	"esp-uploaded-example": {
		"deviceInfo":{
			"current_ip": "192.168.1.141",
			"type": "esp",
			"espInfo": {
				"chipID": "16013813",
				"board_type": "esp01_1m",
				"platform": "espressif",
				"flash_size": 1048576,
				"real_size": 1048576,
				"boot_version": 4,
				"upload_sketch": "basic_esp8266",
    		},
			"device_status": "good",
			"device_name": "esp-uploaded-example",
			"description": "testing new uploader",
			"color":"#4D90FE",
			"path":"/house/upstairs/spare-room/test",
			"card_display_choice": "custom",
			"endPoints":{
				"lastTimeTriggered": {
					"title": "Last Time Triggered",
					"card-type": "crouton-simple-input",
					"static_endpoint_id": "time_input",
					"values":{
						"value": "n/a"
					}
				},
				"alertEmail": {
					"title": "Alert Email",
					"card-type": "crouton-simple-input",
					"static_endpoint_id": "email_input",
					"values": {
						"value": "blah.blah@gmail.com"
					}
				}
			}
		}
	}
}

// esp device will then ask persistence for its states
	// publish /deviceInfo/control/name "get states"
	// persistence will then check active_devices for the name key and return the stored object
	
	// esp verifies that its IP address is consistent with the stored object it has just received
	// esp will set the endpoints accordingly and begin functioning according to the sketch, whenever it disconnects, it will repeat this process
	// esp is now ready to function properly

	// -- future feature for when device names can be changed by the user after uploading
		// if no states are found, the esp will ask persistence for its name
			// the esp device will first get ESP.getChipID
			// publish /deviceInfo/control/CHIPID "get name"
			// persistence will check active devices for CHIPID, return the name
			// esp will then store its name


// persistence.js also keeps a running list of all_devices who have a device_status of "connected"
active_device_list:
	an array with the names ...
	["crouton-demo-new", "esp-uploaded-example"]

	... and an array of names of all_devices that are "connected" and have "type":"esp" 
	["esp-uploaded-example"]
		this is only needed by the uploader because currently it is only intended for ESP chips and arduino sketches

// scheduler.js takes device names and endpoints and adds schedule specific information
// it does not interract with active devices, active device list, or active init list
schedule data:
{
	"esp-bedside-lamp":{
		"alarmLight":{
			"interval":{},
			"schedule":{
				"schedules":[{"D":[1]}],
				"exceptions":[],
				"error":6
			},
		"plain_language":"every day at 5pm",
		"action":"toggle",
		"path":"/house/upstairs/bedroom/",
		"value":"off"}
	},
	"idk":{
		"the endpoint":{
			"interval":{},
			"schedule":{
				"schedules":[],
				"exceptions":[],
				"error":6
			},
		"plain_language":"every morning at 8am",
		"action":"toggle",
		"path":"/whatever/man/",
		"value":"45"
		}
	}
}

// behavior of a custom sketch on an esp chip
	
	// ask persistence/control/device_name/chipID "request states" --  do you have any states with my device_name or chipID
	
	    // if not, receive reply from deviceInfo/control/device_name "no states" 

	      // send deviceInfo/confirm/device_name {default object} -- send the device info object with default endpoints included
	        // NOTE: This step probably isn't necessary. persistence should always have 

	    // if yes, receive each endpoint from [device path]/control/[device_name]/[endpoint_key] (camelized card title) 

	      // receive each endpoint one by one and it's corresponding value

	        // send endpoint_key to function stored in namepins.h at compile time
	        
	        // function returns static_endpoint_id associated with that endpoint
	    
	        // sketch acts on that value as it normally would, using the static_endpoint_id to know for sure what it should do (turn output pin on/off, adjust RGB light, etc)
	        
	        // sketch confirms the value by sending it back on /[path]/[confirm]/[device_name]/[endpoint_key]