angular
  .module('appConverter')
  .factory('DateTimeService', Service);

function Service() {
  return {
    createUtcRange: createUtcRange,
    getRelativeOffset: getRelativeOffset
  };

  function createUtcRange(baseTime, baseTz) {
    let start = moment
      .tz(baseTime, baseTz)
      .startOf('day')
      .valueOf();

    let current = start;
    let utcRange = [];

    _.times(24, (time) => {
      current = moment.tz(start, baseTz).add(time, 'hour').valueOf();
      utcRange.push(current);
    });

    return utcRange;
  }

  function getRelativeOffset(tzName, baseTzName) {
    let now = Date.now();

    let baseTime = moment.tz.zone(baseTzName).offset(now);
    let secondTime = moment.tz.zone(tzName).offset(now);
    let diffInMinutes = baseTime - secondTime;
    let diffInHours = diffInMinutes / 60;

    let viewValue = diffInHours > 0 ? '+' + diffInHours : diffInHours.toString();

    return {
      value: diffInMinutes,
      viewValue: viewValue
    }
  }
}