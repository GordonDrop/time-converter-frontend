class AppController {
  constructor(
    DEFAULT_TIMEZONES,
    ApiService,
    localStorageService
  ) {

    this.deafults = DEFAULT_TIMEZONES;
    this.ApiService = ApiService;
    this.$ls = localStorageService;
    this.loading = true;
    this.baseTime = Date.now();

    this.initStrategies = {
      guessTimezone: 'guessTimezone',
      setDefaults: 'guessTimezone',
      setFromLocalStorage: 'setFromLocalStorage',
      setSetUrlState: 'setSetUrlState'
    }
  }

  $onInit() {
    let savedLocations = this.getFromLocalStorage();
    let initStrategy;

    if (savedLocations) {
      initStrategy = 'setFromLocalStorage';
    } else {
      initStrategy = 'setDefaults';
    }

    this[initStrategy]();
  }

  initData(locations) {
    this.locations = locations;
    this.setBaseLocation(0);
    this.createUTCRange();
    this.saveToLocalStorage();
  }

  createUTCRange() {
    let start = moment
      .tz(this.baseTime, this.baseTimeZone)
      .startOf('day')
      .valueOf();

    let current = start;
    this.utcRange = [];

    _.times(24, (time) => {
      current = moment.tz(start, this.baseTimeZone).add(time, 'hour').valueOf();
      this.utcRange.push(current);
    });

    console.log(this.utcRange);
  }

  isDayStart(timestamp, location) {
    let tz = location.timezone.timeZoneId;
    let dayStart = moment
      .tz(this.baseTime, tz)
      .startOf('day')
      .format('H');

    let time = moment.tz(timestamp, tz).format('H');

    return time === dayStart;
  }

  isDayEnd(timestamp, location) {
    let tz = location.timezone.timeZoneId;
    let dayEnd = moment
      .tz(this.baseTime, tz)
      .endOf('day')
      .format('H');

    let time = moment.tz(timestamp, tz).format('H');

    return time === dayEnd;
  }

  guessTimezone() {}

  setDefaults() {
    this.ApiService.getLocations(this.deafults)
      .then(
        response => {
          this.initData(response);
          this.toggleLoading();
        },
        error => {
          console.log('error loading initial data:', error)
        }
      )
  }

  setFromLocalStorage() {
    this.initData(this.getFromLocalStorage());
    this.toggleLoading();
  }

  setSetUrlState() {}

  toggleLoading() {
    this.loading = !this.loading;
  }

  setBaseLocation(index) {
    this.locations = this.locations.map(location => {
      location.isHome = false;
      return location;
    });

    this.locations[index].isHome = true;
    this.baseTimeZone = this.locations[index].timezone.timeZoneId;
    this.saveToLocalStorage();
  }

  addLocation(location) {
    this.locations.push(location);
    this.saveToLocalStorage();
  }

  removeLocation(locationIndex) {
    let isHome = this.locations[locationIndex].isHome;

    this.locations.splice(locationIndex, 1);
    if (isHome) {
      this.setBaseLocation(0);
    }
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    this.$ls.set('locations', this.locations);
  }

  getFromLocalStorage() {
    return this.$ls.get('locations');
  }
}

const componentDefinition = {
  templateUrl: 'app/components/app/app.template.html',
  controller: AppController
};

angular
  .module('appConverter')
  .component('app', componentDefinition);