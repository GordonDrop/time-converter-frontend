angular
  .module('appConverter')
  .factory('DateTimeService', Service);

function Service() {
  return {
    createUtcRange: createUtcRange,
    getRelativeOffset: getRelativeOffset,
    createWeekRange: createWeekRange,
    isWeekend: isWeekend,
    getDurationString: getDurationString,
    formatChooseTime: formatChooseTime
  };

  // SHOULD range of 7 dates with baseTime in the middle
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

  function createWeekRange(date, tz) {
    let start = moment
      .tz(date, tz)
      .subtract(3, 'day')
      .valueOf();

    let current = start;
    let utcRange = [];

    _.times(7, (time) => {
      current = moment.tz(start, tz).add(time, 'day').valueOf();
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

  function isWeekend(date, tz) {
    let day = moment.tz(date, tz).day();

    return (day === 0) || (day === 6);
  }

  // getDurationString in hh:mm format
  function getDurationString(timeInMinutes) {
    let hours = Math.floor(timeInMinutes / 60);
    let minutes = timeInMinutes % 60;

    return twoDigitsFormat(hours) + ':' + twoDigitsFormat(minutes);
  }

  function twoDigitsFormat(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function formatChooseTime(choosenTime, locations) {
    let result;
    let format = 'HH:mm  ddd, MMM DD Y';
    let newline = '\r\n';

    result = locations.map(location => {
      let arr = [];
      arr[0] = `${location.city}, ${location.country}`;
      arr[1] = moment.tz(choosenTime.start, location.timezone.timeZoneId).format(format);
      arr[2] = moment.tz(choosenTime.end, location.timezone.timeZoneId).format(format);
      arr[3] = newline;

      return arr.join(newline);
    });

    return result.join(newline);
  }
}