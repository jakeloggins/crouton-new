import paho.mqtt.client as mqtt

class MistController(object):

    # mqtt mist controller class

    # topic syntax: location/function/command/device_name/crouton_card_endpoint

    # qos 2 makes sure it's received only once
    # --persistent session so if power is interrupted it resumes?
    
    def __init__(self, interval=300, duration=15, clientid="pi_python"):
        self.interval = interval
        self.duration = duration
        self.clientid = clientid
        self.mist_status + False

        self._mqttc = mqtt.Client(self.clientid)
        self._mqttc.on_message = self.mqtt_on_message
        self._mqttc.on_connect = self.mqtt_on_connect
        self._mqttc.on_publish = self.mqtt_on_publish
        self._mqttc.on_subscribe = self.mqtt_on_subscribe

        # -- this last will message isn't read by anyone, make a separate subscriber that sends alerts for both esp and this script, have it add timestamps 
        # -- and duplicate onmsg_error function
        self._mqttc.will_set("basement/mist/errors/pi", "time lapse script failed", 2)
        self._mqttc.connect("localhost", 1883, 1200)
        self._mqttc.loop_start()
        self._mqttc.subscribe("basement/mist/confirm/#", 2)
        self._mqttc.subscribe("basement/mist/errors/#", 2)
        
        msg = "start" + " " + str(self.interval) + " " + str(self.duration)
        self._mqttc.publish("basement/mist/control/pi", msg, 2)

    def publish_lapselog(self):
        pub_msg = "done" + " " + str(self.interval) + " " + str(self.duration)
        self._mqttc.publish("basement/mist/log/pi", pub_msg, 2)
        # -- nothing gets these messages right now, but come in handy in future
        # call this every time you take a timelapse

    def disconnect(self):
        self._mqttc.disconnect()
        # -- on keyboard press, call disconnect()

    def mqtt_on_message(self, mqttc, obj, msg):
        if mqtt.topic_matches_sub("basement/mist/confirm/#", msg.topic):
            self.onmsg_pi(msg)
        elif mqtt.topic_matches_sub("basement/mist/errors/#", msg.topic):
            self.onmsg_error(msg)

    def onmsg_pi(self, msg):
        parsed = msg.payload.split(" ", 2)
        action = parsed[0]
        interval = int(parsed[1])
        duration = int(parsed[2])
        if interval != self.interval or duration != self.duration:
            pub_msg = "adjust" + " " + str(self.interval) + " " + str(self.duration)
            self._mqttc.publish("basement/mist/control/pi", pub_msg, 2)
        if action == "on":
            self.mist_status = True
        elif action == "off":
            self.mist_status = False

    def onmsg_error(self, msg):
        pass
        # -- send email/text/slack message with msg.payload and msg.topic

    def button_on(self):
        pub_msg = "start" + " " + str(self.interval) + " " + str(self.duration)
        self._mqttc.publish("basement/mist/control/pi", pub_msg, 2)

    def button_off(self):
        self._mqttc.publish("basement/mist/control/pi", "stop", 2)

    def cycle_update(self):
        # parse user input - or set self.interval and self.duration in some other section
        pub_msg = "adjust" + " " + str(self.interval) + " " + str(self.duration)
        self._mqttc.publish("basement/mist/control/pi", pub_msg, 2)

    def button_test(self):
        self._mqttc.publish("basement/mist/control/pi", "test", 2)


# subscribe to /deviceInfo/#/confirm

# when a device confirms, update the JSON into a master list of available devices

    # subscribe to /path/errors/device_name
        # when error is received, remove that device from the master list

    # subscribe to /path/schedule/device_name/endpoint
        # receive a schedule JSON

        "deviceInfo": {
            "status": "good",
            "color": "#4D90FE",
            "name": "crouton-demo-new",
            "path": "/house/downstairs/office/test",
            "type": "pythonscript",
            "endPoints": {
                "barDoor": {
                    "units": "people entered",
                    "values": {
                        "value": 34
                    },
                    "card-type": "crouton-simple-text",
                    "title": "Bar Main Door",
                    "schedule": {
                        "schedules": {
                            "h": [10],
                            "m": [15,45]
                            },
                            {
                            "h": [17],
                            "m": [30]
                            },
                          },
                        "exceptions":
                          {
                            {"M_a": [3]},
                            {"dw": [2]}
                          }
                      };


    # subscribe to /global/#
        # evaluate command
        # evaluate location scope
        # evaluate function match
        # 

