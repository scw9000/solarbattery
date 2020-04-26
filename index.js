var needle = require('needle');

var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-solar-battery", "HomeBattery", LGBattery);
};

function LGBattery(log, config) {
    this.log = log
    this.name = config["name"];
    this.brand = config["brand"];
    this.url = config["url"];

    this.infoservice = new Service.AccessoryInformation(this.brand);
    this.infoservice
        .setCharacteristic(Characteristic.Manufacturer, "LG")
        .setCharacteristic(Characteristic.Model, "LG Chem RESU 10HL")
        .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    this.service = new Service.BatteryService(this.name);

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
  this.log("getting battery level...");
  
  needle.get(this.url, function(err, resp) {
    if (!err && resp.statusCode == 200) {
      var battery = resp.body.battery_level;
      this.log("battery level: %s", battery);
      callback(null, battery);
    }
    else {
      this.log("Error getting battery level (status code %s): %s", resp.statusCode, err);
      callback(err);
    }
  });
}

LGBattery.prototype.getChargingState = function(callback) {
  this.log("getting charging state...");
  
  needle.get(this.url, function(err, resp) {
      if (!err && resp.statusCode == 200) {
        var status = resp.body.status;
        this.log("charging state: %s", status );
        callback(null, status);
      }
      else {
        this.log("Error getting charging state (status code %s): %s", resp.statusCode, err);
        callback(err);
      }
  });
}

LGBattery.prototype.getStatusLowBattery = function(callback) {
  this.log("getting low battery state...");
    
  needle.get(this.url, function(err, resp) {
      if (!err && resp.statusCode == 200) {
        var low = resp.body.low;
        this.log("low battery state: %s", low);
        callback(null, low);
      }
      else {
        this.log("Error getting low battery state (status code %s): %s", response.statusCode, err);
        callback(err);
      }
  });
}

LGBattery.prototype.getServices = function() {
    return [this.service];
  }
