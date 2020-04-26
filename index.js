var needle = require('needle');

var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-solar-battery", "HomeBattery", LGBattery);
};

function LGBattery(log, config) {
    this.log = log;
    this.name = config["name"];
    this.url = config["url"];
    this.BatteryID = config["battery_id"];

    this.service = new Service.BatteryService(this.name);
    // informationService
    //     .setCharacteristic(Characteristic.Manufacturer, "LG")
    //     .setCharacteristic(Characteristic.Model, "LG Chem RESU 10HL")
    //     .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    // let batteryService = new Service.Battery("My Battery");

    this.service
        .getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.getBatteryLevel.bind(this));

    this.service
        .getCharacteristic(Characteristic.ChargingState)
        .on('get', this.getChargingState.bind(this));

    this.service
        .getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this));
}

LGBattery.prototype.getBatteryLevel = function(callback) {
  this.log("getting battery level state...");
  
  needle.get(this.url, function(err, resp) {
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var battery = json.battery_level;
      this.log("battery level: " + battery);
      callback(null, battery);
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  });
}

LGBattery.prototype.getChargingState = function(callback) {
  this.log("getting charging state...");
  
  needle.get(this.url, function(err, resp) {
      if (!err && response.statusCode == 200) {
        var json = JSON.parse(body);
        var status = json.status;
        this.log("battery chars: "  + status );
        callback(null, status);
      }
      else {
        this.log("Error getting state (status code %s): %s", response.statusCode, err);
        callback(err);
      }
  });
}

LGBattery.prototype.getStatusLowBattery = function(callback) {
  this.log("getting low battery level state...");
    
  needle.get(this.url, function(err, resp) {
      if (!err && response.statusCode == 200) {
        var json = JSON.parse(body);
        var low = json.low;
        this.log("battery chars: " + low);
        callback(null, low);
      }
      else {
        this.log("Error getting state (status code %s): %s", response.statusCode, err);
        callback(err);
      }
  });
}

LGBattery.prototype.getServices = function() {
    return [this.service];
  }
