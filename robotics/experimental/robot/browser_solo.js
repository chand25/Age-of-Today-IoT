require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(element) {
  function logHTML(arr) {
    var div = document.createElement("div"),
        text = document.createTextNode(arr.join(""));

    div.appendChild(text);
    element.appendChild(div);
  }

  var Logger = {
    log: function() {
      var args = [].slice.call(arguments, 0);
      logHTML(args);
    }
  };

  ['debug', 'info', 'warn', 'error', 'fatal'].forEach(function(type) {
    Logger[type] = Logger.log;
  });

  return Logger;
};

},{}],2:[function(require,module,exports){
/*
 * cylon-mip driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

/* eslint key-spacing: 0 */

"use strict";

module.exports = {
  PlaySound:              0x06,
  SetPosition:            0x08,
  DistanceDrive:          0x70,
  DriveForwardTime:       0x71,
  DriveBackwardTime:      0x72,
  TurnLeftAngle:          0x73,
  TurnRightAngle:         0x74,
  ContinousDrive:         0x78,
  SetGameMode:            0x76,
  GetGameMode:            0x82,
  Stop:                   0x77,
  RequestStatus:          0x79,
  GetUp:                  0x23,
  RequestWeightUpdate:    0x81,
  RequestChestLED:        0x83,
  SetChestLED:            0x84,
  FlashChestLED:          0x89,
  SetHeadLED:             0x8a,
  RequestHeadLED:         0x8B,
  ReadOdometer:           0x85,
  ResetOdometer:          0x86,
  GestureDetect:          0x0A,
  SetGestureRadarMode:    0x0C,
  GetRadarMode:           0x0D,
  RadarResponse:          0x0C,
  DetectionMode:          0x0E,
  RequestDetectionMode:   0x0F,
  Detected:               0x04,
  ShakeDetected:          0x1A,
  IRRemoteEnabled:        0x10,
  RequestIRRemoteEnabled: 0x11,
  Sleep:                  0xFA,
  DisconnectApp:          0xFE,
  ForceBLEDisconnect:     0xFC,
  SetUserData:            0x12,
  GetUserData:            0x13,
  GetSoftwareVersion:     0x14,
  GetHardwareInfo:        0x19,
  SetVolume:              0x15,
  GetVolume:              0x16,
  SendIRDongleCode:       0x8C,
  ReceiveIRDongleCode:    0x03,
  ClapTimes:              0x1D,
  ClapEnabled:            0x1E,
  RequestClapEnabled:     0x1F,
  ClapDelayTime:          0x20
};

},{}],3:[function(require,module,exports){
(function (Buffer){
/*
 * cylon-mip driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

/* eslint no-unused-vars: 0, camelcase: 0, max-len: 0 */

var Cylon = require("cylon");

var MIPReceiveDataService = "ffe0",
    MIPReceiveDataNotify = "ffe4",
    MIPSendDataService = "ffe5",
    MIPSendDataWrite = "ffe9";

var Codes = require("./codes"),
    Games = require("./games");

var Driver = module.exports = function Driver() {
  Driver.__super__.constructor.apply(this, arguments);

  this.Codes = Codes;
  this.Games = Games;

  this.commands = {
    set_head_led: this.setHeadLED,
    set_chest_led: this.setChestLED,
    flash_chest_led: this.flashChestLED,
    get_up: this.getUp,
    drive_distance: this.driveDistance,
    drive_forward: this.driveForward,
    drive_backward: this.driveBackward,
    turn_left: this.turnLeft,
    turn_right: this.turnRight,
    set_game_mode: this.setGameMode,
    stop: this.stop
  };
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

/**
 * Starts the driver
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Driver.prototype.start = function(callback) {
  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

/**
 * Sets the Head LEDs of the MiP
 *
 * @param {Number} light1 light one value
 * @param {Number} light2 light two value
 * @param {Number} light3 light three value
 * @param {Number} light4 light four value
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.setHeadLED = function(light1, light2, light3, light4, callback) {
  var packet = new Array(5);
  packet[0] = this.Codes.SetHeadLED;
  packet[1] = light1;
  packet[2] = light2;
  packet[3] = light3;
  packet[4] = light4;
  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Sets the Chest LED color of the MiP
 *
 * @param {Number} r red value
 * @param {Number} g green value
 * @param {Number} b blue value
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.setChestLED = function(r, g, b, callback) {
  var packet = new Array(4);
  packet[0] = this.Codes.SetChestLED;
  packet[1] = r;
  packet[2] = g;
  packet[3] = b;
  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Flashes the chest LED of the MiP
 *
 * @param {Number} r red value
 * @param {Number} g green value
 * @param {Number} b blue value
 * @param {Number} timeOn time on
 * @param {Number} timeOff time off
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.flashChestLED = function(r, g, b, timeOn, timeOff, callback) {
  var packet = new Array(6);
  packet[0] = this.Codes.FlashChestLED;
  packet[1] = r;
  packet[2] = g;
  packet[3] = b;
  packet[4] = timeOn;
  packet[5] = timeOff;
  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to get up.
 *
 * @param {Number} stand MiP should stand
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.getUp = function(stand, callback) {
  var packet = new Array(2);
  packet[0] = this.Codes.GetUp;
  packet[1] = stand;
  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to drive a distance, in a direction
 *
 * @param {Number} direction direction to drive
 * @param {Number} distance distance to drive
 * @param {Number} turnDirection direction to turn
 * @param {Number} turnAngle angle to turn
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.driveDistance = function(direction, distance, turnDirection, turnAngle, callback) {
  var packet = new Buffer(6);
  packet[0] = this.Codes.DistanceDrive;
  packet[1] = direction;
  packet[2] = distance;
  packet[3] = turnDirection;
  packet.writeUInt16BE(turnAngle, 4);

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to drive forward
 *
 * @param {Number} speed speed to move at
 * @param {Number} time how long to move
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.driveForward = function(speed, time, callback) {
  var packet = new Buffer(3);
  packet[0] = this.Codes.DriveForwardTime;
  packet[1] = speed;
  packet[2] = time;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to drive backward
 *
 * @param {Number} speed speed to move at
 * @param {Number} time how long to move
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.driveBackward = function(speed, time, callback) {
  var packet = new Buffer(3);
  packet[0] = this.Codes.DriveBackwardTime;
  packet[1] = speed;
  packet[2] = time;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to turn to the left
 *
 * @param {Number} angle angle to turn to
 * @param {Number} speed speed to turn at
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.turnLeft = function(angle, speed, callback) {
  var packet = new Buffer(3);
  packet[0] = this.Codes.TurnLeftAngle;
  packet[1] = angle;
  packet[2] = speed;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to turn to the right
 *
 * @param {Number} angle angle to turn to
 * @param {Number} speed speed to turn at
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.turnRight = function(angle, speed, callback) {
  var packet = new Buffer(3);
  packet[0] = this.Codes.TurnRightAngle;
  packet[1] = angle;
  packet[2] = speed;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to start the specified game mode
 *
 * @param {Number} mode mode to set to
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.setGameMode = function(mode, callback) {
  var packet = new Buffer(2);
  packet[0] = this.Codes.SetGameMode;
  packet[1] = mode;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Tells the MiP to stop whatever it's doing.
 *
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Driver.prototype.stop = function(callback) {
  var packet = new Buffer(1);
  packet[0] = this.Codes.Stop;

  this._writeServiceCharacteristic(MIPSendDataService,
    MIPSendDataWrite,
    packet,
    callback
  );
};

/**
 * Writes a service characteristic to the MiP
 *
 * @param {Number} s ID of service to write to
 * @param {Number} c ID of characteristic to write to
 * @param {Number} value value to write
 * @param {Function} callback function to call when done
 * @return {void}
 */
Driver.prototype._writeServiceCharacteristic = function(s, c, value, callback) {
  this.connection.writeServiceCharacteristic(s, c, new Buffer(value),
    function(err, data) {
      if (typeof callback === "function") { callback(err, data); }
    }
  );
};

}).call(this,require("buffer").Buffer)
},{"./codes":2,"./games":4,"buffer":50,"cylon":5}],4:[function(require,module,exports){
/*
 * cylon-mip driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

module.exports = {
  // App - The same as cancel Gesture and Radar
  App: 0x01,

  // Cage - Play back
  Cage: 0x02,

  // Tracking - The same as enable Radar
  Tracking: 0x03,

  // Dance - Play back
  Dance: 0x04,

  // Default Mip Mode - The same as enable Gesture(0x0A)
  Default: 0x05,

  // Stack - Play back
  Stack: 0x06,

  // Trick - programming and playback
  Trick: 0x07,

  // Roam Mode - Play back
  Roam: 0x08
};

},{}],5:[function(require,module,exports){
(function (process){
"use strict";

var MCP = require("./lib/mcp");

module.exports = {
  MCP: require("./lib/mcp"),

  Robot: require("./lib/robot"),

  Driver: require("./lib/driver"),
  Adaptor: require("./lib/adaptor"),

  Utils: require("./lib/utils"),
  Logger: require("./lib/logger"),

  IO: {
    DigitalPin: require("./lib/io/digital-pin"),
    Utils: require("./lib/io/utils")
  },

  robot: MCP.create,
  api: require("./lib/api").create,
  config: require("./lib/config").update,

  start: MCP.start,
  halt: MCP.halt
};

process.on("SIGINT", function() {
  MCP.halt(process.kill.bind(process, process.pid));
});

if (process.platform === "win32") {
  var io = { input: process.stdin, output: process.stdout },
      quit = process.emit.bind(process, "SIGINT");

  require("readline").createInterface(io).on("SIGINT", quit);
}

}).call(this,require('_process'))
},{"./lib/adaptor":6,"./lib/api":7,"./lib/config":9,"./lib/driver":10,"./lib/io/digital-pin":12,"./lib/io/utils":13,"./lib/logger":14,"./lib/mcp":15,"./lib/robot":17,"./lib/utils":22,"_process":54,"readline":48}],6:[function(require,module,exports){
"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in connection", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Adaptor class
 *
 * @constructor Adaptor
 *
 * @param {Object} [opts] adaptor options
 * @param {String} [opts.name] the adaptor's name
 * @param {Object} [opts.robot] the robot the adaptor belongs to
 * @param {Object} [opts.host] the host the adaptor will connect to
 * @param {Object} [opts.port] the port the adaptor will connect to
 */
var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;

  // the Robot the adaptor belongs to
  this.robot = opts.robot;

  // some default options
  this.host = opts.host;
  this.port = opts.port;

  // misc. details provided in args hash
  this.details = {};

  _.each(opts, function(opt, name) {
    if (!_.includes(["robot", "name", "adaptor", "events"], name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Adaptor, Basestar);

/**
 * A base connect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.connect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#connect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base disconnect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.disconnect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#disconnect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Expresses the Adaptor in a JSON-serializable format
 *
 * @return {Object} a representation of the Adaptor in a serializable format
 */
Adaptor.prototype.toJSON = function() {
  return {
    name: this.name,
    adaptor: this.constructor.name || this.name,
    details: this.details
  };
};

},{"./basestar":8,"./utils":22,"./utils/helpers":23}],7:[function(require,module,exports){
"use strict";

var MCP = require("./mcp"),
    Logger = require("./logger"),
    _ = require("./utils/helpers");

var api = module.exports = {};

api.instances = [];

/**
 * Creates a new API instance
 *
 * @param {String} [Server] which API plugin to use (e.g. "http" loads
 * cylon-api-http)
 * @param {Object} opts options for the new API instance
 * @return {void}
 */
api.create = function create(Server, opts) {
  // if only passed options (or nothing), assume HTTP server
  if (Server == null || _.isObject(Server) && !_.isFunction(Server)) {
    opts = Server;
    Server = "http";
  }

  opts = opts || {};

  if (_.isString(Server)) {
    var req = "cylon-api-" + Server;

    try {
      Server = require(req);
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
      }

      [
        "Cannot find the " + req + " API module.",
        "You may be able to install it: `npm install " + req + "`"
      ].forEach(Logger.log);

      throw new Error("Missing API plugin - cannot proceed");
    }
  }

  opts.mcp = MCP;

  var instance = new Server(opts);
  api.instances.push(instance);
  instance.start();
};

},{"./logger":14,"./mcp":15,"./utils/helpers":23}],8:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;

var Utils = require("./utils"),
    _ = require("./utils/helpers");

/**
 * The Basestar class is a wrapper class around EventEmitter that underpins most
 * other Cylon adaptor/driver classes, providing useful external base methods
 * and functionality.
 *
 * @constructor Basestar
 */
var Basestar = module.exports = function Basestar() {
  Utils.classCallCheck(this, Basestar);
};

Utils.subclass(Basestar, EventEmitter);

/**
 * Proxies calls from all methods in the source to a target object
 *
 * @param {String[]} methods methods to proxy
 * @param {Object} target object to proxy methods to
 * @param {Object} source object to proxy methods from
 * @param {Boolean} [force=false] whether or not to overwrite existing methods
 * @return {Object} the source
 */
Basestar.prototype.proxyMethods = Utils.proxyFunctionsToObject;

/**
 * Triggers the provided callback, and emits an event with the provided data.
 *
 * If an error is provided, emits the 'error' event.
 *
 * @param {String} event what event to emit
 * @param {Function} callback function to be invoked with error/data
 * @param {*} err possible error value
 * @param {...*} data data values to be passed to error/callback
 * @return {void}
 */
Basestar.prototype.respond = function(event, callback, err) {
  var args = Array.prototype.slice.call(arguments, 3);

  if (err) {
    this.emit("error", err);
  } else {
    this.emit.apply(this, [event].concat(args));
  }

  if (typeof callback === "function") {
    callback.apply(this, [err].concat(args));
  }
};

/**
 * Defines an event handler to proxy events from a source object to a target
 *
 * @param {Object} opts event options
 * @param {EventEmitter} opts.source source of events to listen for
 * @param {EventEmitter} opts.target target new events should be emitted from
 * @param {String} opts.eventName name of event to listen for, and proxy
 * @param {Bool} [opts.sendUpdate=false] whether to emit the 'update' event
 * @param {String} [opts.targetEventName] new event name to emit from target
 * @return {EventEmitter} the source object
 */
Basestar.prototype.defineEvent = function(opts) {
  opts.sendUpdate = opts.sendUpdate || false;
  opts.targetEventName = opts.targetEventName || opts.eventName;

  opts.source.on(opts.eventName, function() {
    var args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
    args.unshift(opts.targetEventName);
    opts.target.emit.apply(opts.target, args);

    if (opts.sendUpdate) {
      args.unshift("update");
      opts.target.emit.apply(opts.target, args);
    }
  });

  return opts.source;
};

/**
 * A #defineEvent shorthand for adaptors.
 *
 * Proxies events from an adaptor's connector to the adaptor itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the adaptor's connector
 */
Basestar.prototype.defineAdaptorEvent = function(opts) {
  return this._proxyEvents(opts, this.connector, this);
};

/**
 * A #defineEvent shorthand for drivers.
 *
 * Proxies events from an driver's connection to the driver itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the driver's connection
 */
Basestar.prototype.defineDriverEvent = function(opts) {
  return this._proxyEvents(opts, this.connection, this);
};

Basestar.prototype._proxyEvents = function(opts, source, target) {
  opts = _.isString(opts) ? { eventName: opts } : opts;

  opts.source = source;
  opts.target = target;

  return this.defineEvent(opts);
};

},{"./utils":22,"./utils/helpers":23,"events":51}],9:[function(require,module,exports){
"use strict";

var _ = require("./utils/helpers");

var config = module.exports = {},
    callbacks = [];

// default data
config.haltTimeout = 3000;
config.testMode = false;
config.logger = null;
config.silent = false;
config.debug = false;

/**
 * Updates the Config, and triggers handler callbacks
 *
 * @param {Object} data new configuration information to set
 * @return {Object} the updated configuration
 */
config.update = function update(data) {
  var forbidden = ["update", "subscribe", "unsubscribe"];

  Object.keys(data).forEach(function(key) {
    if (~forbidden.indexOf(key)) { delete data[key]; }
  });

  if (!Object.keys(data).length) {
    return config;
  }

  _.extend(config, data);

  callbacks.forEach(function(callback) { callback(data); });

  return config;
};

/**
 * Subscribes a function to be called whenever the config is updated
 *
 * @param {Function} callback function to be called with updated data
 * @return {void}
 */
config.subscribe = function subscribe(callback) {
  callbacks.push(callback);
};

/**
 * Unsubscribes a callback from configuration changes
 *
 * @param {Function} callback function to unsubscribe from changes
 * @return {void}
 */
config.unsubscribe = function unsubscribe(callback) {
  var idx = callbacks.indexOf(callback);
  if (idx >= 0) { callbacks.splice(idx, 1); }
};

},{"./utils/helpers":23}],10:[function(require,module,exports){
"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in driver", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Driver class
 *
 * @constructor Driver
 * @param {Object} [opts] driver options
 * @param {String} [opts.name] the driver's name
 * @param {Object} [opts.robot] the robot the driver belongs to
 * @param {Object} [opts.connection] the adaptor the driver works through
 * @param {Number} [opts.pin] the pin number the driver should have
 * @param {Number} [opts.interval=10] read interval in milliseconds
 */
var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;
  this.robot = opts.robot;

  this.connection = opts.connection;

  this.commands = {};
  this.events = [];

  // some default options
  this.pin = opts.pin;
  this.interval = opts.interval || 10;

  this.details = {};

  _.each(opts, function(opt, name) {
    var banned = ["robot", "name", "connection", "driver", "events"];

    if (!_.includes(banned, name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Driver, Basestar);

/**
 * A base start function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.start = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#start method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base halt function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.halt = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#halt method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Sets up an array of commands for the Driver.
 *
 * Proxies commands from the Driver to its connection (or a manually specified
 * proxy), and adds a snake_cased version to the driver's commands object.
 *
 * @param {String[]} commands an array of driver commands
 * @param {Object} [proxy=this.connection] proxy target
 * @return {void}
 */
Driver.prototype.setupCommands = function(commands, proxy) {
  if (proxy == null) {
    proxy = this.connection;
  }

  Utils.proxyFunctionsToObject(commands, proxy, this);

  function endsWith(string, substr) {
    return string.indexOf(substr, string.length - substr.length) !== -1;
  }

  commands.forEach(function(command) {
    var snakeCase = command.replace(/[A-Z]+/g, function(match) {
      if (match.length > 1 && !endsWith(command, match)) {
        match = match.replace(/[A-Z]$/, function(m) {
          return "_" + m.toLowerCase();
        });
      }

      return "_" + match.toLowerCase();
    }).replace(/^_/, "");

    this.commands[snakeCase] = this[command];
  }, this);
};

/**
 * Expresses the Driver in a JSON-serializable format
 *
 * @return {Object} a representation of the Driver in a serializable format
 */
Driver.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.constructor.name || this.name,
    connection: this.connection.name,
    commands: Object.keys(this.commands),
    events: this.events,
    details: this.details
  };
};

},{"./basestar":8,"./utils":22,"./utils/helpers":23}],11:[function(require,module,exports){
(function (process){
"use strict";

var Registry = require("./registry"),
    Config = require("./config"),
    _ = require("./utils/helpers");

function testMode() {
  return process.env.NODE_ENV === "test" && Config.testMode;
}

module.exports = function Initializer(type, opts) {
  var mod;

  mod = Registry.findBy(type, opts[type]);

  if (!mod) {
    if (opts.module) {
      Registry.register(opts.module);
    } else {
      Registry.register("cylon-" + opts[type]);
    }

    mod = Registry.findBy(type, opts[type]);
  }

  if (!mod) {
    var err = [ "Unable to find", type, "for", opts[type] ].join(" ");
    throw new Error(err);
  }

  var obj = mod[type](opts);

  _.each(obj, function(prop, name) {
    if (name === "constructor") {
      return;
    }

    if (_.isFunction(prop)) {
      obj[name] = prop.bind(obj);
    }
  });

  if (testMode()) {
    var test = Registry.findBy(type, "test")[type](opts);

    _.each(obj, function(prop, name) {
      if (_.isFunction(prop) && !test[name]) {
        test[name] = function() { return true; };
      }
    });

    return test;
  }

  return obj;
};

}).call(this,require('_process'))
},{"./config":9,"./registry":16,"./utils/helpers":23,"_process":54}],12:[function(require,module,exports){
/* eslint no-sync: 0 */

"use strict";

var FS = require("fs"),
    EventEmitter = require("events").EventEmitter;

var Utils = require("../utils");

var GPIO_PATH = "/sys/class/gpio";

var GPIO_READ = "in";
var GPIO_WRITE = "out";

/**
 * The DigitalPin class provides an interface with the Linux GPIO system present
 * in single-board computers such as Raspberry Pi, or Beaglebone Black.
 *
 * @constructor DigitalPin
 * @param {Object} opts digital pin options
 * @param {String} pin which pin number to use
 * @param {String} mode which pin mode to use
 */
var DigitalPin = module.exports = function DigitalPin(opts) {
  this.pinNum = opts.pin.toString();
  this.status = "low";
  this.ready = false;
  this.mode = opts.mode;
};

Utils.subclass(DigitalPin, EventEmitter);

DigitalPin.prototype.connect = function(mode) {
  if (this.mode == null) {
    this.mode = mode;
  }

  FS.exists(this._pinPath(), function(exists) {
    if (exists) {
      this._openPin();
    } else {
      this._createGPIOPin();
    }
  }.bind(this));
};

DigitalPin.prototype.close = function() {
  FS.writeFile(this._unexportPath(), this.pinNum, function(err) {
    this._closeCallback(err);
  }.bind(this));
};

DigitalPin.prototype.closeSync = function() {
  FS.writeFileSync(this._unexportPath(), this.pinNum);
  this._closeCallback(false);
};

DigitalPin.prototype.digitalWrite = function(value) {
  if (this.mode !== "w") {
    this._setMode("w");
  }

  this.status = value === 1 ? "high" : "low";

  FS.writeFile(this._valuePath(), value, function(err) {
    if (err) {
      var str = "Error occurred while writing value ";
      str += value + " to pin " + this.pinNum;

      this.emit("error", str);
    } else {
      this.emit("digitalWrite", value);
    }
  }.bind(this));

  return value;
};

// Public: Reads the digial pin"s value periodicly on a supplied interval,
// and emits the result or an error
//
// interval - time (in milliseconds) to read from the pin at
//
// Returns the defined interval
DigitalPin.prototype.digitalRead = function(interval) {
  if (this.mode !== "r") { this._setMode("r"); }

  Utils.every(interval, function() {
    FS.readFile(this._valuePath(), function(err, data) {
      if (err) {
        var error = "Error occurred while reading from pin " + this.pinNum;
        this.emit("error", error);
      } else {
        var readData = parseInt(data.toString(), 10);
        this.emit("digitalRead", readData);
      }
    }.bind(this));
  }.bind(this));
};

DigitalPin.prototype.setHigh = function() {
  return this.digitalWrite(1);
};

DigitalPin.prototype.setLow = function() {
  return this.digitalWrite(0);
};

DigitalPin.prototype.toggle = function() {
  return (this.status === "low") ? this.setHigh() : this.setLow();
};

// Creates the GPIO file to read/write from
DigitalPin.prototype._createGPIOPin = function() {
  FS.writeFile(this._exportPath(), this.pinNum, function(err) {
    if (err) {
      this.emit("error", "Error while creating pin files");
    } else {
      this._openPin();
    }
  }.bind(this));
};

DigitalPin.prototype._openPin = function() {
  this._setMode(this.mode, true);
  this.emit("open");
};

DigitalPin.prototype._closeCallback = function(err) {
  if (err) {
    this.emit("error", "Error while closing pin files");
  } else {
    this.emit("close", this.pinNum);
  }
};

// Sets the mode for the pin by writing the values to the pin reference files
DigitalPin.prototype._setMode = function(mode, emitConnect) {
  if (emitConnect == null) { emitConnect = false; }

  this.mode = mode;

  var data = (mode === "w") ? GPIO_WRITE : GPIO_READ;

  FS.writeFile(this._directionPath(), data, function(err) {
    this._setModeCallback(err, emitConnect);
  }.bind(this));
};

DigitalPin.prototype._setModeCallback = function(err, emitConnect) {
  if (err) {
    return this.emit("error", "Setting up pin direction failed");
  }

  this.ready = true;

  if (emitConnect) {
    this.emit("connect", this.mode);
  }
};

DigitalPin.prototype._directionPath = function() {
  return this._pinPath() + "/direction";
};

DigitalPin.prototype._valuePath = function() {
  return this._pinPath() + "/value";
};

DigitalPin.prototype._pinPath = function() {
  return GPIO_PATH + "/gpio" + this.pinNum;
};

DigitalPin.prototype._exportPath = function() {
  return GPIO_PATH + "/export";
};

DigitalPin.prototype._unexportPath = function() {
  return GPIO_PATH + "/unexport";
};

},{"../utils":22,"events":51,"fs":48}],13:[function(require,module,exports){
"use strict";

module.exports = {
  /**
   * Calculates PWM Period and Duty based on provided params.
   *
   * @param {Number} scaledDuty the scaled duty value
   * @param {Number} freq frequency to use
   * @param {Number} pulseWidth pulse width
   * @param {String} [polarity=high] polarity value (high or low)
   * @return {Object} calculated period and duty encapsulated in an object
   */
  periodAndDuty: function(scaledDuty, freq, pulseWidth, polarity) {
    var period, duty, maxDuty;

    polarity = polarity || "high";
    period = Math.round(1.0e9 / freq);

    if (pulseWidth != null) {
      var pulseWidthMin = pulseWidth.min * 1000,
          pulseWidthMax = pulseWidth.max * 1000;

      maxDuty = pulseWidthMax - pulseWidthMin;
      duty = Math.round(pulseWidthMin + (maxDuty * scaledDuty));
    } else {
      duty = Math.round(period * scaledDuty);
    }

    if (polarity === "low") {
      duty = period - duty;
    }

    return { period: period, duty: duty };
  }
};

},{}],14:[function(require,module,exports){
(function (process){
"use strict";

/* eslint no-use-before-define: 0 */

var Config = require("./config"),
    _ = require("./utils/helpers");

var BasicLogger = function basiclogger(str) {
  var prefix = new Date().toISOString() + " : ";
  console.log(prefix + str);
};

var NullLogger = function nulllogger() {};

var Logger = module.exports = {
  setup: setup,

  should: {
    log: true,
    debug: false
  },

  log: function log(str) {
    if (Logger.should.log) {
      Logger.logger.call(Logger.logger, str);
    }
  },

  debug: function debug(str) {
    if (Logger.should.log && Logger.should.debug) {
      Logger.logger.call(Logger.logger, str);
    }
  }
};

function setup(opts) {
  if (_.isObject(opts)) { _.extend(Config, opts); }

  var logger = Config.logger;

  // if no logger supplied, use basic logger
  if (logger == null) { logger = BasicLogger; }

  // if logger is still falsy, use NullLogger
  Logger.logger = logger || NullLogger;

  Logger.should.log = !Config.silent;
  Logger.should.debug = Config.debug;

  // --silent CLI flag overrides
  if (_.includes(process.argv, "--silent")) {
    Logger.should.log = false;
  }

  // --debug CLI flag overrides
  if (_.includes(process.argv, "--debug")) {
    Logger.should.debug = false;
  }

  return Logger;
}

setup();
Config.subscribe(setup);

// deprecated holdovers
["info", "warn", "error", "fatal"].forEach(function(method) {
  var called = false;

  function showDeprecationNotice() {
    console.log("The method Logger#" + method + " has been deprecated.");
    console.log("It will be removed in Cylon 2.0.0.");
    console.log("Please switch to using the #log or #debug Logger methods");

    called = true;
  }

  Logger[method] = function() {
    if (!called) { showDeprecationNotice(); }
    Logger.log.apply(null, arguments);
  };
});

}).call(this,require('_process'))
},{"./config":9,"./utils/helpers":23,"_process":54}],15:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;

var Config = require("./config"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Robot = require("./robot"),
    _ = require("./utils/helpers");

var mcp = module.exports = new EventEmitter();

mcp.robots = {};
mcp.commands = {};
mcp.events = [ "robot_added", "robot_removed" ];

/**
 * Creates a new Robot with the provided options.
 *
 * @param {Object} opts robot options
 * @return {Robot} the new robot
 */
mcp.create = function create(opts) {
  opts = opts || {};

  // check if a robot with the same name exists already
  if (opts.name && mcp.robots[opts.name]) {
    var original = opts.name;
    opts.name = Utils.makeUnique(original, Object.keys(mcp.robots));

    var str = "Robot names must be unique. Renaming '";
    str += original + "' to '" + opts.name + "'";

    Logger.log(str);
  }

  var bot = new Robot(opts);
  mcp.robots[bot.name] = bot;
  mcp.emit("robot_added", bot.name);

  return bot;
};

mcp.start = function start(callback) {
  var fns = _.pluck(mcp.robots, "start");

  _.parallel(fns, function() {
    var mode = Utils.fetch(Config, "workMode", "async");
    if (mode === "sync") { _.invoke(mcp.robots, "startWork"); }
    callback();
  });
};

/**
 * Halts all MCP robots.
 *
 * @param {Function} callback function to call when done halting robots
 * @return {void}
 */
mcp.halt = function halt(callback) {
  callback = callback || function() {};

  var timeout = setTimeout(callback, Config.haltTimeout || 3000);

  _.parallel(_.pluck(mcp.robots, "halt"), function() {
    clearTimeout(timeout);
    callback();
  });
};

/**
 * Serializes MCP robots, commands, and events into a JSON-serializable Object.
 *
 * @return {Object} a serializable representation of the MCP
 */
mcp.toJSON = function() {
  return {
    robots: _.invoke(mcp.robots, "toJSON"),
    commands: Object.keys(mcp.commands),
    events: mcp.events
  };
};

},{"./config":9,"./logger":14,"./robot":17,"./utils":22,"./utils/helpers":23,"events":51}],16:[function(require,module,exports){
(function (process){
"use strict";

var Logger = require("./logger"),
    _ = require("./utils/helpers");

// Explicitly these modules here, so Browserify can grab them later
require("./test/loopback");
require("./test/test-adaptor");
require("./test/test-driver");
require("./test/ping");

var missingModuleError = function(module) {
  var str = "Cannot find the '" + module + "' module.\n";
  str += "This problem might be fixed by installing it with ";
  str += "'npm install " + module + "' and trying again.";

  console.log(str);

  process.emit("SIGINT");
};

var Registry = module.exports = {
  data: {},

  register: function(module) {
    if (this.data[module]) {
      return this.data[module].module;
    }

    var pkg;

    try {
      pkg = require(module);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(module);
      }

      throw e;
    }

    this.data[module] = {
      module: pkg,
      adaptors: pkg.adaptors || [],
      drivers: pkg.drivers || [],
      dependencies: pkg.dependencies || []
    };

    this.logRegistration(module, this.data[module]);

    this.data[module].dependencies.forEach(function(dep) {
      Registry.register(dep);
    });

    return this.data[module].module;
  },

  findBy: function(prop, name) {
    // pluralize, if necessary
    if (prop.slice(-1) !== "s") {
      prop += "s";
    }

    return this.search(prop, name);
  },

  findByModule: function(module) {
    if (!this.data[module]) {
      return null;
    }

    return this.data[module].module;
  },

  logRegistration: function(name) {
    var module = this.data[name];

    Logger.debug("Registering module " + name);

    ["adaptors", "drivers", "dependencies"].forEach(function(field) {
      if (module[field].length) {
        Logger.debug("  " + field + ":");
        module[field].forEach(function(item) {
          Logger.debug("    - " + item);
        });
      }
    });
  },

  search: function(entry, value) {
    for (var name in this.data) {
      if (this.data.hasOwnProperty(name)) {
        var repo = this.data[name];

        if (repo[entry] && _.includes(repo[entry], value)) {
          return repo.module;
        }
      }
    }

    return false;
  }
};

// Default drivers/adaptors:
["loopback", "ping", "test-adaptor", "test-driver"].forEach(function(module) {
  Registry.register("./test/" + module);
});

}).call(this,require('_process'))
},{"./logger":14,"./test/loopback":18,"./test/ping":19,"./test/test-adaptor":20,"./test/test-driver":21,"./utils/helpers":23,"_process":54}],17:[function(require,module,exports){
(function (process){
"use strict";

var initializer = require("./initializer"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Config = require("./config"),
    _ = require("./utils/helpers");

var validator = require("./validator");

var EventEmitter = require("events").EventEmitter;

// used when creating default robot names
var ROBOT_ID = 1;

/**
 * Creates a new Robot instance based on provided options
 *
 * @constructor
 * @param {Object} opts object with Robot options
 * @param {String} [name] the name the robot should have
 * @param {Object} [connections] object containing connection info for the Robot
 * @param {Object} [devices] object containing device information for the Robot
 * @param {Function} [work] a function the Robot will run when started
 * @returns {Robot} new Robot instance
 */
var Robot = module.exports = function Robot(opts) {
  Utils.classCallCheck(this, Robot);

  opts = opts || {};

  validator.validate(opts);

  // auto-bind prototype methods
  for (var prop in Object.getPrototypeOf(this)) {
    if (this[prop] && prop !== "constructor") {
      this[prop] = this[prop].bind(this);
    }
  }

  this.initRobot(opts);

  _.each(opts, function(opt, name) {
    if (this[name] !== undefined) {
      return;
    }

    if (_.isFunction(opt)) {
      this[name] = opt.bind(this);

      if (opts.commands == null) {
        this.commands[name] = opt.bind(this);
      }
    } else {
      this[name] = opt;
    }
  }, this);

  if (opts.commands) {
    var cmds;

    if (_.isFunction(opts.commands)) {
      cmds = opts.commands.call(this);
    } else {
      cmds = opts.commands;
    }

    if (_.isObject(cmds)) {
      this.commands = cmds;
    } else {
      var err = "#commands must be an object ";
      err += "or a function that returns an object";
      throw new Error(err);
    }
  }

  var mode = Utils.fetch(Config, "mode", "manual");

  if (mode === "auto") {
    // run on the next tick, to allow for "work" event handlers to be set up
    setTimeout(this.start, 0);
  }
};

Utils.subclass(Robot, EventEmitter);

/**
 * Condenses information on a Robot to a JSON-serializable format
 *
 * @return {Object} serializable information on the Robot
 */
Robot.prototype.toJSON = function() {
  return {
    name: this.name,
    connections: _.invoke(this.connections, "toJSON"),
    devices: _.invoke(this.devices, "toJSON"),
    commands: Object.keys(this.commands),
    events: _.isArray(this.events) ? this.events : []
  };
};

/**
 * Adds a new Connection to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Connection to use
 * @param {Object} conn options for the Connection initializer
 * @return {Object} the robot
 */
Robot.prototype.connection = function(name, conn) {
  conn.robot = this;
  conn.name = name;

  if (this.connections[conn.name]) {
    var original = conn.name,
        str;

    conn.name = Utils.makeUnique(original, Object.keys(this.connections));

    str = "Connection names must be unique.";
    str += "Renaming '" + original + "' to '" + conn.name + "'";
    this.log(str);
  }

  this.connections[conn.name] = initializer("adaptor", conn);

  return this;
};

/**
 * Initializes all values for a new Robot.
 *
 * @param {Object} opts object passed to Robot constructor
 * @return {void}
 */
Robot.prototype.initRobot = function(opts) {
  this.name = opts.name || "Robot " + ROBOT_ID++;
  this.running = false;

  this.connections = {};
  this.devices = {};

  this.work = opts.work || opts.play;

  this.commands = {};

  if (!this.work) {
    this.work = function() { this.log("No work yet."); };
  }

  _.each(opts.connections, function(conn, key) {
    var name = _.isString(key) ? key : conn.name;

    if (conn.devices) {
      opts.devices = opts.devices || {};

      _.each(conn.devices, function(device, d) {
        device.connection = name;
        opts.devices[d] = device;
      });

      delete conn.devices;
    }

    this.connection(name, _.extend({}, conn));
  }, this);

  _.each(opts.devices, function(device, key) {
    var name = _.isString(key) ? key : device.name;
    this.device(name, _.extend({}, device));
  }, this);
};

/**
 * Adds a new Device to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Device to use
 * @param {Object} device options for the Device initializer
 * @return {Object} the robot
 */
Robot.prototype.device = function(name, device) {
  var str;

  device.robot = this;
  device.name = name;

  if (this.devices[device.name]) {
    var original = device.name;
    device.name = Utils.makeUnique(original, Object.keys(this.devices));

    str = "Device names must be unique.";
    str += "Renaming '" + original + "' to '" + device.name + "'";
    this.log(str);
  }

  if (_.isString(device.connection)) {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      this.log(str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    for (var c in this.connections) {
      device.connection = this.connections[c];
      break;
    }
  }

  this.devices[device.name] = initializer("driver", device);

  return this;
};

/**
 * Starts the Robot's connections, then devices, then work.
 *
 * @param {Function} callback function to be triggered when the Robot has
 * started working
 * @return {Object} the Robot
 */
Robot.prototype.start = function(callback) {
  if (this.running) {
    return this;
  }

  var mode = Utils.fetch(Config, "workMode", "async");

  var start = function() {
    if (mode === "async") {
      this.startWork();
    }
  }.bind(this);

  _.series([
    this.startConnections,
    this.startDevices,
    start
  ], function(err, results) {
    if (err) {
      this.log("An error occured while trying to start the robot:");
      this.log(err);

      this.halt(function() {
        if (_.isFunction(this.error)) {
          this.error.call(this, err);
        }

        if (this.listeners("error").length) {
          this.emit("error", err);
        }
      }.bind(this));
    }

    if (_.isFunction(callback)) {
      callback(err, results);
    }
  }.bind(this));

  return this;
};

/**
 * Starts the Robot's work function
 *
 * @return {void}
 */
Robot.prototype.startWork = function() {
  this.log("Working.");

  this.emit("ready", this);
  this.work.call(this, this);
  this.running = true;
};

/**
 * Starts the Robot's connections
 *
 * @param {Function} callback function to be triggered after the connections are
 * started
 * @return {void}
 */
Robot.prototype.startConnections = function(callback) {
  this.log("Starting connections.");

  var starters = _.map(this.connections, function(conn) {
    return function(cb) {
      return this.startConnection(conn, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single connection on Robot
 *
 * @param {Object} connection to start
 * @param {Function} callback function to be triggered after the connection is
 * started
 * @return {void}
 */
Robot.prototype.startConnection = function(connection, callback) {
  if (connection.connected === true) {
    return callback.call(connection);
  }

  var str = "Starting connection '" + connection.name + "'";

  if (connection.host) {
    str += " on host " + connection.host;
  } else if (connection.port) {
    str += " on port " + connection.port;
  }

  this.log(str + ".");
  connection.connect.call(connection, callback);
  connection.connected = true;
  return true;
};

/**
 * Starts the Robot's devices
 *
 * @param {Function} callback function to be triggered after the devices are
 * started
 * @return {void}
 */
Robot.prototype.startDevices = function(callback) {
  var log = this.log;

  log("Starting devices.");

  var starters = _.map(this.devices, function(device) {
    return function(cb) {
      return this.startDevice(device, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single device on Robot
 *
 * @param {Object} device to start
 * @param {Function} callback function to be triggered after the device is
 * started
 * @return {void}
 */
Robot.prototype.startDevice = function(device, callback) {
  if (device.started === true) {
    return callback.call(device);
  }

  var log = this.log;
  var str = "Starting device '" + device.name + "'";

  if (device.pin) {
    str += " on pin " + device.pin;
  }

  log(str + ".");
  this[device.name] = device;
  device.start.call(device, callback);
  device.started = true;

  return device.started;
};

/**
 * Halts the Robot, attempting to gracefully stop devices and connections.
 *
 * @param {Function} callback to be triggered when the Robot has stopped
 * @return {void}
 */
Robot.prototype.halt = function(callback) {
  callback = callback || function() {};

  if (!this.running) {
    return callback();
  }

  // ensures callback(err) won't prevent others from halting
  function wrap(fn) {
    return function(cb) { fn.call(null, cb.bind(null, null)); };
  }

  var devices = _.pluck(this.devices, "halt").map(wrap),
      connections = _.pluck(this.connections, "disconnect").map(wrap);

  try {
    _.parallel(devices, function() {
      _.parallel(connections, callback);
    });
  } catch (e) {
    var msg = "An error occured while attempting to safely halt the robot";
    this.log(msg);
    this.log(e.message);
  }

  this.running = false;
};

/**
 * Generates a String representation of a Robot
 *
 * @return {String} representation of a Robot
 */
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

Robot.prototype.log = function(str) {
  Logger.log("[" + this.name + "] - " + str);
};

}).call(this,require('_process'))
},{"./config":9,"./initializer":11,"./logger":14,"./utils":22,"./utils/helpers":23,"./validator":25,"_process":54,"events":51}],18:[function(require,module,exports){
"use strict";

var Adaptor = require("../adaptor"),
    Utils = require("../utils");

var Loopback = module.exports = function Loopback() {
  Loopback.__super__.constructor.apply(this, arguments);
};

Utils.subclass(Loopback, Adaptor);

Loopback.prototype.connect = function(callback) {
  callback();
};

Loopback.prototype.disconnect = function(callback) {
  callback();
};

Loopback.adaptors = ["loopback"];
Loopback.adaptor = function(opts) { return new Loopback(opts); };

},{"../adaptor":6,"../utils":22}],19:[function(require,module,exports){
"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var Ping = module.exports = function Ping() {
  Ping.__super__.constructor.apply(this, arguments);

  this.commands = {
    ping: this.ping
  };

  this.events = ["ping"];
};

Utils.subclass(Ping, Driver);

Ping.prototype.ping = function() {
  this.emit("ping", "ping");
  return "pong";
};

Ping.prototype.start = function(callback) {
  callback();
};

Ping.prototype.halt = function(callback) {
  callback();
};

Ping.drivers = ["ping"];
Ping.driver = function(opts) { return new Ping(opts); };

},{"../driver":10,"../utils":22}],20:[function(require,module,exports){
"use strict";

var Adaptor = require("../adaptor"),
    Utils = require("../utils");

var TestAdaptor = module.exports = function TestAdaptor() {
  TestAdaptor.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestAdaptor, Adaptor);

TestAdaptor.adaptors = ["test"];
TestAdaptor.adaptor = function(opts) { return new TestAdaptor(opts); };

},{"../adaptor":6,"../utils":22}],21:[function(require,module,exports){
"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var TestDriver = module.exports = function TestDriver() {
  TestDriver.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestDriver, Driver);

TestDriver.drivers = ["test"];
TestDriver.driver = function(opts) { return new TestDriver(opts); };

},{"../driver":10,"../utils":22}],22:[function(require,module,exports){
(function (global){
"use strict";

var _ = require("./utils/helpers");

var monkeyPatches = require("./utils/monkey-patches");

var Utils = module.exports = {
  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "every 5 seconds, do this thing")
   *
   * @param {Number} interval delay between action invocations
   * @param {Function} action function to trigger every time interval elapses
   * @example every((5).seconds(), function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  every: function every(interval, action) {
    return setInterval(action, interval);
  },

  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "after 5 seconds, do this thing")
   *
   * @param {Number} delay how long to wait
   * @param {Function} action action to perform after delay
   * @example after((5).seconds(), function() {});
   * @return {timeoutId} setTimeout ID to pass to clearTimeout()
   */
  after: function after(delay, action) {
    return setTimeout(action, delay);
  },

  /**
   * A wrapper around setInterval, with a delay of 0ms
   *
   * @param {Function} action function to invoke constantly
   * @example constantly(function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  constantly: function constantly(action) {
    return every(0, action);
  },

  /**
   * A wrapper around clearInterval
   *
   * @param {intervalID} intervalID ID of every/after/constantly
   * @example finish(blinking);
   * @return {void}
   */
  finish: function finish(intervalID) {
    clearInterval(intervalID);
  },

  /**
   * Sleeps the program for a period of time.
   *
   * Use of this is not advised, as your program can't do anything else while
   * it's running.
   *
   * @param {Number} ms number of milliseconds to sleep
   * @return {void}
   */
  sleep: function sleep(ms) {
    var start = Date.now(),
        i = 0;

    while (Date.now() < start + ms) {
      i = i.toString();
    }
  },

  /**
   * Utility for providing class inheritance.
   *
   * Based on CoffeeScript's implementation of inheritance.
   *
   * Parent class methods/properites are available on Child.__super__.
   *
   * @param {Function} child the descendent class
   * @param {Function} parent the parent class
   * @return {Function} the child class
   */
  subclass: function subclass(child, parent) {
    var Ctor = function() {
      this.constructor = child;
    };

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  },

  proxyFunctions: function proxyFunctions(source, target) {
    _.each(source, function(prop, key) {
      if (_.isFunction(prop) && !target[key]) {
        target[key] = prop.bind(source);
      }
    });
  },

  /**
   * Proxies calls from all methods in the source to a target object
   *
   * @param {String[]} methods methods to proxy
   * @param {Object} target object to proxy methods to
   * @param {Object} [base=this] object to proxy methods from
   * @param {Boolean} [force=false] whether to overwrite existing methods
   * @return {Object} the base
   */
  proxyFunctionsToObject: function(methods, target, base, force) {
    if (base == null) {
      base = this;
    }

    force = force || false;

    methods.forEach(function(method) {
      if (_.isFunction(base[method]) && !force) {
        return;
      }

      base[method] = function() {
        return target[method].apply(target, arguments);
      };
    });

    return base;
  },

  classCallCheck: function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  },

  /**
   * Approximation of Ruby's Hash#fetch method for object property lookup
   *
   * @param {Object} obj object to do lookup on
   * @param {String} property property name to attempt to access
   * @param {*} fallback a fallback value if property can't be found. if
   * a function, will be invoked with the string property name.
   * @throws Error if fallback needed but not provided, or fallback fn doesn't
   * return anything
   * @example
   *    fetch({ property: "hello world" }, "property"); //=> "hello world"
   * @example
   *    fetch({}, "notaproperty", "default value"); //=> "default value"
   * @example
   *    var notFound = function(prop) { return prop + " not found!" };
   *    fetch({}, "notaproperty", notFound); //=> "notaproperty not found!"
   * @example
   *    var badFallback = function(prop) { prop + " not found!" };
   *    fetch({}, "notaproperty", badFallback);
   *    // Error: no return value from provided callback function
   * @example
   *    fetch(object, "notaproperty");
   *    // Error: key not found: "notaproperty"
   * @return {*} fetched property, fallback, or fallback function return value
   */
  fetch: function(obj, property, fallback) {
    if (obj.hasOwnProperty(property)) {
      return obj[property];
    }

    if (fallback === void 0) {
      throw new Error("key not found: \"" + property + "\"");
    }

    if (_.isFunction(fallback)) {
      var value = fallback(property);

      if (value === void 0) {
        throw new Error("no return value from provided fallback function");
      }

      return value;
    }

    return fallback;
  },

  /**
   * Given a name, and an array of existing names, returns a unique new name
   *
   * @param {String} name the name that's colliding with existing names
   * @param {String[]} arr array of existing names
   * @example
   *   makeUnique("hello", ["hello", "hello-1", "hello-2"]); //=> "hello3"
   * @return {String} the new name
   */
  makeUnique: function(name, arr) {
    var newName;

    if (!~arr.indexOf(name)) {
      return name;
    }

    for (var n = 1; ; n++) {
      newName = name + "-" + n;
      if (!~arr.indexOf(newName)) {
        return newName;
      }
    }
  },

  /**
   * Adds every/after/constantly to the global namespace, and installs
   * monkey-patches.
   *
   * @return {Object} utils object
   */
  bootstrap: function bootstrap() {
    global.every = this.every;
    global.after = this.after;
    global.constantly = this.constantly;

    monkeyPatches.install();

    return this;
  }
};

Utils.bootstrap();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/helpers":23,"./utils/monkey-patches":24}],23:[function(require,module,exports){
"use strict";

/* eslint no-use-before-define: 0 */

var __slice = Array.prototype.slice;

var H = module.exports = {};

function identity(value) {
  return value;
}

function extend(base, source) {
  var isArray = Array.isArray(source);

  if (base == null) {
    base = isArray ? [] : {};
  }

  if (isArray) {
    source.forEach(function(e, i) {
      if (typeof base[i] === "undefined") {
        base[i] = e;
      } else if (typeof e === "object") {
        base[i] = extend(base[i], e);
      } else if (!~base.indexOf(e)) {
        base.push(e);
      }
    });
  } else {
    var key;

    for (key in source) {
      if (typeof source[key] !== "object" || !source[key]) {
        base[key] = source[key];
      } else if (base[key]) {
        extend(base[key], source[key]);
      } else {
        base[key] = source[key];
      }
    }
  }

  return base;
}

extend(H, {
  identity: identity,
  extend: extend
});

function kind(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}

function isA(type) {
  return function(thing) {
    return kind(thing) === type;
  };
}

extend(H, {
  isObject: isA("Object"),
  isObjectLoose: function(thing) { return typeof thing === "object"; },
  isFunction: isA("Function"),
  isArray: isA("Array"),
  isString: isA("String"),
  isNumber: isA("Number"),
  isArguments: isA("Arguments"),
  isUndefined: isA("Undefined")
});

function iterate(thing, fn, thisVal) {
  if (H.isArray(thing)) {
    thing.forEach(fn, thisVal);
    return;
  }

  if (H.isObject(thing)) {
    for (var key in thing) {
      var value = thing[key];
      fn.call(thisVal, value, key);
    }
  }
}

function pluck(collection, key) {
  var keys = [];

  iterate(collection, function(object) {
    if (H.isObject(object)) {
      if (H.isFunction(object[key])) {
        keys.push(object[key].bind(object));
      } else {
        keys.push(object[key]);
      }
    }
  });

  return keys;
}

function map(collection, fn, thisVal) {
  var vals = [];

  if (fn == null) {
    fn = identity;
  }

  iterate(collection, function(object, index) {
    vals.push(fn.call(thisVal, object, index));
  });

  return vals;
}

function invoke(collection, fn) {
  var args = __slice.call(arguments, 2),
      vals = [];

  iterate(collection, function(object) {
    if (H.isFunction(fn)) {
      vals.push(fn.apply(object, args));
      return;
    }

    vals.push(object[fn].apply(object, arguments));
  });

  return vals;
}

function reduce(collection, iteratee, accumulator, thisVal) {
  var isArray = H.isArray(collection);

  if (!isArray && !H.isObjectLoose(collection)) {
    return null;
  }

  if (iteratee == null) {
    iteratee = identity;
  }

  if (accumulator == null) {
    if (isArray) {
      accumulator = collection.shift();
    } else {
      for (var key in collection) {
        accumulator = collection[key];
        delete collection[key];
        break;
      }
    }
  }

  iterate(collection, function(object, name) {
    accumulator = iteratee.call(thisVal, accumulator, object, name);
  });

  return accumulator;
}

extend(H, {
  pluck: pluck,
  each: iterate,
  map: map,
  invoke: invoke,
  reduce: reduce
});

function arity(fn, n) {
  return function() {
    var args = __slice.call(arguments, 0, n);
    return fn.apply(null, args);
  };
}

function partial(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, args.concat(__slice.call(arguments)));
  };
}

function partialRight(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, __slice.call(arguments).concat(args));
  };
}

extend(H, {
  arity: arity,
  partial: partial,
  partialRight: partialRight
});

function includes(arr, value) {
  return !!~arr.indexOf(value);
}

extend(H, {
  includes: includes
});

function parallel(functions, done) {
  var total = functions.length,
      completed = 0,
      results = [],
      error;

  if (typeof done !== "function") { done = function() {}; }

  function callback(err, result) {
    if (error) {
      return;
    }

    if (err || error) {
      error = err;
      done(err);
      return;
    }

    completed++;
    results.push(result);

    if (completed === total) {
      done(null, results);
    }
  }

  if (!functions.length) { done(); }

  functions.forEach(function(fn) { fn(callback); });
}

extend(H, {
  parallel: parallel
});

function series(functions, done) {
  var results = [],
      error;

  if (typeof done !== "function") { done = function() {}; }

  function callback(err, result) {
    if (err || error) {
      error = err;
      return done(err);
    }

    results.push(result);

    if (!functions.length) {
      return done(null, results);
    }

    next();
  }

  function next() {
    functions.shift()(callback);
  }

  if (!functions.length) { done(null, results); }
  next();
}

extend(H, {
  series: series
});

},{}],24:[function(require,module,exports){
/* eslint no-extend-native: 0 key-spacing: 0 */

"use strict";

var max = Math.max,
    min = Math.min;

var originals = {
  seconds:   Number.prototype.seconds,
  second:    Number.prototype.second,
  fromScale: Number.prototype.fromScale,
  toScale:   Number.prototype.toScale
};

module.exports.uninstall = function() {
  for (var opt in originals) {
    if (originals[opt] == null) {
      Number.prototype[opt] = originals[opt];
    } else {
      delete Number.prototype[opt];
    }
  }
};

module.exports.install = function() {
  /**
   * Multiplies a number by 60000 to convert minutes
   * to milliseconds
   *
   * @example
   * (2).minutes(); //=> 120000
   * @return {Number} time in milliseconds
   */
  Number.prototype.minutes = function() {
    return this * 60000;
  };

  /**
   * Alias for Number.prototype.minutes
   *
   * @see Number.prototype.minute
   * @example
   * (1).minute(); //=>60000
   * @return {Number} time in milliseconds
   */
  Number.prototype.minute = Number.prototype.minutes;

  /**
   * Multiplies a number by 1000 to convert seconds
   * to milliseconds
   *
   * @example
   * (2).seconds(); //=> 2000
   * @return {Number} time in milliseconds
   */
  Number.prototype.seconds = function() {
    return this * 1000;
  };

  /**
   * Alias for Number.prototype.seconds
   *
   * @see Number.prototype.seconds
   * @example
   * (1).second(); //=> 1000
   * @return {Number} time in milliseconds
   */
  Number.prototype.second = Number.prototype.seconds;

  /**
   * Passthru to get time in milliseconds
   *
   * @example
   * (200).milliseconds(); //=> 200
   * @return {Number} time in milliseconds
   */
  Number.prototype.milliseconds = function() {
    return this;
  };

  /**
   * Alias for Number.prototype.milliseconds
   *
   * @see Number.prototype.milliseconds
   * @example
   * (100).ms(); //=> 100
   * @return {Number} time in milliseconds
   */
  Number.prototype.ms = Number.prototype.milliseconds;

  /**
   * Converts microseconds to milliseconds.
   * Note that timing of events in terms of microseconds
   * is not very accurate in JS.
   *
   * @example
   * (2000).microseconds(); //=> 2
   * @return {Number} time in milliseconds
   */
  Number.prototype.microseconds = function() {
    return this / 1000;
  };

  /**
   * Converts a number from a current scale to a 0 - 1 scale.
   *
   * @param {Number} start low point of scale to convert from
   * @param {Number} end high point of scale to convert from
   * @example
   * (5).fromScale(0, 10) //=> 0.5
   * @return {Number} the scaled value
   */
  Number.prototype.fromScale = function(start, end) {
    var val = (this - min(start, end)) / (max(start, end) - min(start, end));

    if (val > 1) {
      return 1;
    }

    if (val < 0) {
      return 0;
    }

    return val;
  };

  /**
   * Converts a number from a 0 - 1 scale to the specified scale.
   *
   * @param {Number} start low point of scale to convert to
   * @param {Number} end high point of scale to convert to
   * @example
   * (0.5).toScale(0, 10) //=> 5
   * @return {Number} the scaled value
   */
  Number.prototype.toScale = function(start, end) {
    var i = this * (max(start, end) - min(start, end)) + min(start, end);

    if (i < start) {
      return start;
    }

    if (i > end) {
      return end;
    }

    return i;
  };
};

},{}],25:[function(require,module,exports){
"use strict";

// validates an Object containing Robot parameters

var Logger = require("./logger"),
    _ = require("./utils/helpers");

function hasProp(object, prop) {
  return object.hasOwnProperty(prop);
}

function die() {
  var RobotDSLError = new Error("Unable to start robot due to a syntax error");
  RobotDSLError.name = "RobotDSLError";
  throw RobotDSLError;
}

function warn(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
}

function fatal(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
  die();
}

var checks = {};

checks.singleObjectSyntax = function(opts, key) {
  var single = hasProp(opts, key),
      plural = hasProp(opts, key + "s");

  if (single && !plural) {
    fatal([
      "The single-object '" + key + "' syntax for robots is not valid.",
      "Instead, use the multiple-value '" + key + "s' key syntax.",
      "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
    ]);
  }
};

checks.singleObjectSyntax = function(opts) {
  ["connection", "device"].map(function(key) {
    var single = hasProp(opts, key),
        plural = hasProp(opts, key + "s");

    if (single && !plural) {
      fatal([
        "The single-object '" + key + "' syntax for robots is not valid.",
        "Instead, use the multiple-value '" + key + "s' key syntax.",
        "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
      ]);
    }
  });
};

checks.deviceWithoutDriver = function(opts) {
  if (opts.devices) {
    _.each(opts.devices, function(device, name) {
      if (!device.driver || device.driver === "") {
        fatal("No driver supplied for device " + name);
      }
    });
  }
};

checks.devicesWithoutConnection = function(opts) {
  var connections = opts.connections,
      devices = opts.devices;

  if (devices && connections && Object.keys(connections).length > 1) {
    var first = Object.keys(connections)[0];

    _.each(devices, function(device, name) {
      if (!device.connection || device.connection === "") {
        warn([
          "No explicit connection provided for device " + name,
          "Will default to using connection " + first
        ]);
      }
    });
  }
};

checks.noConnections = function(opts) {
  var connections = Object.keys(opts.connections || {}).length,
      devices = Object.keys(opts.devices || {}).length;

  if (devices && !connections) {
    fatal(["No connections provided for devices"]);
  }
};

module.exports.validate = function validate(opts) {
  opts = opts || {};

  _.each(checks, function(check) {
    check(opts);
  });
};

},{"./logger":14,"./utils/helpers":23}],26:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./lib/adaptor":27,"./lib/api":28,"./lib/config":30,"./lib/driver":31,"./lib/io/digital-pin":33,"./lib/io/utils":34,"./lib/logger":35,"./lib/mcp":36,"./lib/robot":38,"./lib/utils":43,"_process":54,"dup":5,"readline":48}],27:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./basestar":29,"./utils":43,"./utils/helpers":44,"dup":6}],28:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./logger":35,"./mcp":36,"./utils/helpers":44,"dup":7}],29:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./utils":43,"./utils/helpers":44,"dup":8,"events":51}],30:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./utils/helpers":44,"dup":9}],31:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./basestar":29,"./utils":43,"./utils/helpers":44,"dup":10}],32:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./config":30,"./registry":37,"./utils/helpers":44,"_process":54,"dup":11}],33:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"../utils":43,"dup":12,"events":51,"fs":48}],34:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],35:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./config":30,"./utils/helpers":44,"_process":54,"dup":14}],36:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./config":30,"./logger":35,"./robot":38,"./utils":43,"./utils/helpers":44,"dup":15,"events":51}],37:[function(require,module,exports){
(function (process){
"use strict";

var Logger = require("./logger"),
    _ = require("./utils/helpers"),
    path = require("path");

// Explicitly these modules here, so Browserify can grab them later
require("./test/loopback");
require("./test/test-adaptor");
require("./test/test-driver");
require("./test/ping");

var missingModuleError = function(module) {
  var str = "Cannot find the '" + module + "' module.\n";
  str += "This problem might be fixed by installing it with ";
  str += "'npm install " + module + "' and trying again.";

  console.log(str);

  process.emit("SIGINT");
};

var Registry = module.exports = {
  data: {},

  register: function(module) {
    if (this.data[module]) {
      return this.data[module].module;
    }

    var pkg;

    try {
      if (this.isModuleInDevelopment(module)) {
        pkg = require(path.resolve(".") + "/index");
      } else {
        pkg = require(module);
      }
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(module);
      }

      throw e;
    }

    this.data[module] = {
      module: pkg,
      adaptors: pkg.adaptors || [],
      drivers: pkg.drivers || [],
      dependencies: pkg.dependencies || []
    };

    this.logRegistration(module, this.data[module]);

    this.data[module].dependencies.forEach(function(dep) {
      Registry.register(dep);
    });

    return this.data[module].module;
  },

  findBy: function(prop, name) {
    // pluralize, if necessary
    if (prop.slice(-1) !== "s") {
      prop += "s";
    }

    return this.search(prop, name);
  },

  findByModule: function(module) {
    if (!this.data[module]) {
      return null;
    }

    return this.data[module].module;
  },

  logRegistration: function(name) {
    var module = this.data[name];

    Logger.debug("Registering module " + name);

    ["adaptors", "drivers", "dependencies"].forEach(function(field) {
      if (module[field].length) {
        Logger.debug("  " + field + ":");
        module[field].forEach(function(item) {
          Logger.debug("    - " + item);
        });
      }
    });
  },

  search: function(entry, value) {
    for (var name in this.data) {
      if (this.data.hasOwnProperty(name)) {
        var repo = this.data[name];

        if (repo[entry] && _.includes(repo[entry], value)) {
          return repo.module;
        }
      }
    }

    return false;
  },

  isModuleInDevelopment: function(module) {
    return (path.basename(path.resolve(".")) === module);
  }
};

// Default drivers/adaptors:
["loopback", "ping", "test-adaptor", "test-driver"].forEach(function(module) {
  Registry.register("./test/" + module);
});

}).call(this,require('_process'))
},{"./logger":35,"./test/loopback":39,"./test/ping":40,"./test/test-adaptor":41,"./test/test-driver":42,"./utils/helpers":44,"_process":54,"path":53}],38:[function(require,module,exports){
(function (process){
"use strict";

var initializer = require("./initializer"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Config = require("./config"),
    _ = require("./utils/helpers");

var validator = require("./validator");

var EventEmitter = require("events").EventEmitter;

// used when creating default robot names
var ROBOT_ID = 1;

/**
 * Creates a new Robot instance based on provided options
 *
 * @constructor
 * @param {Object} opts object with Robot options
 * @param {String} [name] the name the robot should have
 * @param {Object} [connections] object containing connection info for the Robot
 * @param {Object} [devices] object containing device information for the Robot
 * @param {Function} [work] a function the Robot will run when started
 * @returns {Robot} new Robot instance
 */
var Robot = module.exports = function Robot(opts) {
  Utils.classCallCheck(this, Robot);

  opts = opts || {};

  validator.validate(opts);

  // auto-bind prototype methods
  for (var prop in Object.getPrototypeOf(this)) {
    if (this[prop] && prop !== "constructor") {
      this[prop] = this[prop].bind(this);
    }
  }

  this.initRobot(opts);

  _.each(opts, function(opt, name) {
    if (this[name] !== undefined) {
      return;
    }

    if (_.isFunction(opt)) {
      this[name] = opt.bind(this);

      if (opts.commands == null) {
        this.commands[name] = opt.bind(this);
      }
    } else {
      this[name] = opt;
    }
  }, this);

  if (opts.commands) {
    var cmds;

    if (_.isFunction(opts.commands)) {
      cmds = opts.commands.call(this);
    } else {
      cmds = opts.commands;
    }

    if (_.isObject(cmds)) {
      this.commands = cmds;
    } else {
      var err = "#commands must be an object ";
      err += "or a function that returns an object";
      throw new Error(err);
    }
  }

  var mode = Utils.fetch(Config, "mode", "manual");

  if (mode === "auto") {
    // run on the next tick, to allow for "work" event handlers to be set up
    setTimeout(this.start, 0);
  }
};

Utils.subclass(Robot, EventEmitter);

/**
 * Condenses information on a Robot to a JSON-serializable format
 *
 * @return {Object} serializable information on the Robot
 */
Robot.prototype.toJSON = function() {
  return {
    name: this.name,
    connections: _.invoke(this.connections, "toJSON"),
    devices: _.invoke(this.devices, "toJSON"),
    commands: Object.keys(this.commands),
    events: _.isArray(this.events) ? this.events : []
  };
};

/**
 * Adds a new Connection to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Connection to use
 * @param {Object} conn options for the Connection initializer
 * @return {Object} the robot
 */
Robot.prototype.connection = function(name, conn) {
  conn.robot = this;
  conn.name = name;

  if (this.connections[conn.name]) {
    var original = conn.name,
        str;

    conn.name = Utils.makeUnique(original, Object.keys(this.connections));

    str = "Connection names must be unique.";
    str += "Renaming '" + original + "' to '" + conn.name + "'";
    this.log(str);
  }
  if ("adapter" in conn) {
    conn.adaptor = conn.adapter;
  }
  this.connections[conn.name] = initializer("adaptor", conn);

  return this;
};

/**
 * Initializes all values for a new Robot.
 *
 * @param {Object} opts object passed to Robot constructor
 * @return {void}
 */
Robot.prototype.initRobot = function(opts) {
  this.name = opts.name || "Robot " + ROBOT_ID++;
  this.running = false;

  this.connections = {};
  this.devices = {};

  this.work = opts.work || opts.play;

  this.commands = {};

  if (!this.work) {
    this.work = function() { this.log("No work yet."); };
  }

  _.each(opts.connections, function(conn, key) {
    var name = _.isString(key) ? key : conn.name;

    if (conn.devices) {
      opts.devices = opts.devices || {};

      _.each(conn.devices, function(device, d) {
        device.connection = name;
        opts.devices[d] = device;
      });

      delete conn.devices;
    }

    this.connection(name, _.extend({}, conn));
  }, this);

  _.each(opts.devices, function(device, key) {
    var name = _.isString(key) ? key : device.name;
    this.device(name, _.extend({}, device));
  }, this);
};

/**
 * Adds a new Device to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Device to use
 * @param {Object} device options for the Device initializer
 * @return {Object} the robot
 */
Robot.prototype.device = function(name, device) {
  var str;

  device.robot = this;
  device.name = name;

  if (this.devices[device.name]) {
    var original = device.name;
    device.name = Utils.makeUnique(original, Object.keys(this.devices));

    str = "Device names must be unique.";
    str += "Renaming '" + original + "' to '" + device.name + "'";
    this.log(str);
  }

  if (_.isString(device.connection)) {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      this.log(str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    for (var c in this.connections) {
      device.connection = this.connections[c];
      break;
    }
  }

  this.devices[device.name] = initializer("driver", device);

  return this;
};

/**
 * Starts the Robot's connections, then devices, then work.
 *
 * @param {Function} callback function to be triggered when the Robot has
 * started working
 * @return {Object} the Robot
 */
Robot.prototype.start = function(callback) {
  if (this.running) {
    return this;
  }

  var mode = Utils.fetch(Config, "workMode", "async");

  var start = function() {
    if (mode === "async") {
      this.startWork();
    }
  }.bind(this);

  _.series([
    this.startConnections,
    this.startDevices,
    start
  ], function(err, results) {
    if (err) {
      this.log("An error occured while trying to start the robot:");
      this.log(err);

      this.halt(function() {
        if (_.isFunction(this.error)) {
          this.error.call(this, err);
        }

        if (this.listeners("error").length) {
          this.emit("error", err);
        }
      }.bind(this));
    }

    if (_.isFunction(callback)) {
      callback(err, results);
    }
  }.bind(this));

  return this;
};

/**
 * Starts the Robot's work function
 *
 * @return {void}
 */
Robot.prototype.startWork = function() {
  this.log("Working.");

  this.emit("ready", this);
  this.work.call(this, this);
  this.running = true;
};

/**
 * Starts the Robot's connections
 *
 * @param {Function} callback function to be triggered after the connections are
 * started
 * @return {void}
 */
Robot.prototype.startConnections = function(callback) {
  this.log("Starting connections.");

  var starters = _.map(this.connections, function(conn) {
    return function(cb) {
      return this.startConnection(conn, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single connection on Robot
 *
 * @param {Object} connection to start
 * @param {Function} callback function to be triggered after the connection is
 * started
 * @return {void}
 */
Robot.prototype.startConnection = function(connection, callback) {
  if (connection.connected === true) {
    return callback.call(connection);
  }

  var str = "Starting connection '" + connection.name + "'";

  if (connection.host) {
    str += " on host " + connection.host;
  } else if (connection.port) {
    str += " on port " + connection.port;
  }

  this.log(str + ".");
  this[connection.name] = connection;
  connection.connect.call(connection, callback);
  connection.connected = true;
  return true;
};

/**
 * Starts the Robot's devices
 *
 * @param {Function} callback function to be triggered after the devices are
 * started
 * @return {void}
 */
Robot.prototype.startDevices = function(callback) {
  var log = this.log;

  log("Starting devices.");

  var starters = _.map(this.devices, function(device) {
    return function(cb) {
      return this.startDevice(device, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single device on Robot
 *
 * @param {Object} device to start
 * @param {Function} callback function to be triggered after the device is
 * started
 * @return {void}
 */
Robot.prototype.startDevice = function(device, callback) {
  if (device.started === true) {
    return callback.call(device);
  }

  var log = this.log;
  var str = "Starting device '" + device.name + "'";

  if (device.pin) {
    str += " on pin " + device.pin;
  }

  log(str + ".");
  this[device.name] = device;
  device.start.call(device, callback);
  device.started = true;

  return device.started;
};

/**
 * Halts the Robot, attempting to gracefully stop devices and connections.
 *
 * @param {Function} callback to be triggered when the Robot has stopped
 * @return {void}
 */
Robot.prototype.halt = function(callback) {
  callback = callback || function() {};

  if (!this.running) {
    return callback();
  }

  // ensures callback(err) won't prevent others from halting
  function wrap(fn) {
    return function(cb) { fn.call(null, cb.bind(null, null)); };
  }

  var devices = _.pluck(this.devices, "halt").map(wrap),
      connections = _.pluck(this.connections, "disconnect").map(wrap);

  try {
    _.parallel(devices, function() {
      _.parallel(connections, callback);
    });
  } catch (e) {
    var msg = "An error occured while attempting to safely halt the robot";
    this.log(msg);
    this.log(e.message);
  }

  this.running = false;
};

/**
 * Generates a String representation of a Robot
 *
 * @return {String} representation of a Robot
 */
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

Robot.prototype.log = function(str) {
  Logger.log("[" + this.name + "] - " + str);
};

}).call(this,require('_process'))
},{"./config":30,"./initializer":32,"./logger":35,"./utils":43,"./utils/helpers":44,"./validator":46,"_process":54,"events":51}],39:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"../adaptor":27,"../utils":43,"dup":18}],40:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../driver":31,"../utils":43,"dup":19}],41:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../adaptor":27,"../utils":43,"dup":20}],42:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../driver":31,"../utils":43,"dup":21}],43:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"./utils/helpers":44,"./utils/monkey-patches":45,"dup":22}],44:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],45:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],46:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"./logger":35,"./utils/helpers":44,"dup":25}],47:[function(require,module,exports){
(function (process){
"use strict";

var Cylon = require('cylon');


// log directly to the page if we're in the browser
if (process.browser) {
  var BrowserLogger = require('./browser-logger'),
      logContainer = document.getElementById("log");

  console.log("Setting logger!");
  Cylon.Logger.setup({
    logger: BrowserLogger(logContainer),
    level: 'debug'
  });
}


const EventEmitter = require('events');


Cylon.robot({
  connections: { bluetooth: {adaptor: 'central', uuid: 'jkhhfsjklsjl', }},
  devices: {
    mip: { driver: "mip" }
  },

work: function(my) {
  let r = (Math.floor(Math.random() * 256));
  let g = (Math.floor(Math.random() * 256));
  let b = (Math.floor(Math.random() * 256));





   after((2).seconds(), function() {
       my.mip.driveDistance(0, 5, 0, 0);
       console.log('Step Forward');
    });

  my.mip.setHeadLED(3, 3, 3, 3);
    after((3).seconds(), function() {
     my.mip.turnLeft(45, 30);
     console.log('Turn to the Left');
    });

    my.mip.setHeadLED(2, 2, 2, 2);

    after((4).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    my.mip.setHeadLED(1, 1, 1, 1);

    after((5).seconds(), function() {
      my.mip.turnRight(45, 30);
       console.log('Turn to the Right');
    });

     after((6).seconds(), function() {
     my.mip.turnLeft(45, 50);
     console.log('Turn to the Left');
    });

    after((7).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((8).seconds(), function() {
      my.mip.turnRight(45, 50);
       console.log('Turn to the Right');
    });

    after((9).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((10).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((11).seconds(), function() {
      my.mip.turnLeft(360, 50);
       console.log('All the way around to my Left');
    });


    after((12).seconds(), function() {
      my.mip.turnRight(45, 30);
       console.log('Turn to the Right');
    });

     after((13).seconds(), function() {
     my.mip.turnLeft(45, 50);
     console.log('Turn to the Left');
    });

    after((14).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((15).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((16).seconds(), function() {
      my.mip.turnLeft(360, 50);
       console.log('All the way around my Left');
    });

    after((17).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((19).seconds(), function() {
      my.mip.driveDistance(2, 5,0,0);
       console.log('Moonwalk');
    });

    after((22).seconds(), function() {
      my.mip.turnRight(270, 5);
       console.log('Slow turn to face crowd');
    });
//every is a Alias to JavaScript's setInterval() function
  every((2).second(), function() {
    my.mip.flashChestLED(b, r, g);
   });

  every((3).second(), function() {
    my.mip.flashChestLED(g, b, r);
   });

 every((5).second(), function() {
    my.mip.flashChestLED(r, g, b);
   });


   after((35).seconds(), function() {
      console.log("I'm finished my solo. I need a partner. Come join me Sanaa.");
      my.mip.stop;
      Cylon.halt();
    });


},




}).start();

}).call(this,require('_process'))
},{"./browser-logger":1,"_process":54,"cylon":26,"events":51}],48:[function(require,module,exports){

},{}],49:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],50:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":49,"ieee754":52}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = 0;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],52:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],53:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":54}],54:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"cylon-mip":[function(require,module,exports){
"use strict";

var MIP = require("./lib/driver");

module.exports = {
  drivers: ["mip"],

  driver: function(opts) {
    return new MIP(opts);
  }
};

},{"./lib/driver":3}]},{},[47]);
