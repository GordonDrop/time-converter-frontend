angular
  .module('appConverter')
  .filter('timezoneDiff', function() {
    return function(timezoneId, baseTZ) {
      let now = Date.now();

      let baseTime = moment.tz.zone(baseTZ).offset(now);
      let secondTime = moment.tz.zone(timezoneId).offset(now);
      let diff = (baseTime - secondTime) / 60;
      return diff > 0 ? '+' + diff.toString() : diff.toString();
    };
  });