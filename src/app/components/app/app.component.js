// TODO: add date sharing via google calendar api
// TODO: timezone guess
// TODO: url logic initialization
// TODO: change time format
// TODO: add pwa

class Controller {
  constructor(
    DEFAULT_TIMEZONES,
    DEFAULT_SETTINGS,
    DEFAULT_INTERVAL,
    ApiService,
    DateTimeService,
    localStorageService
  ) {
    this.deafults = DEFAULT_TIMEZONES;
    this.defaultInterval = DEFAULT_INTERVAL;
    this.ApiService = ApiService;
    this.DateTimeService = DateTimeService;
    this.$ls = localStorageService;
    this.loading = true;
    this.choosing = false;

    this.initStrategies = {
      guessTimezone: 'guessTimezone',
      initWithDefaults: 'initWithDefaults',
      initFromLocalStorage: 'initFromLocalStorage',
      initFromUrlState: 'initFromUrlState'
    };

    this.settingsDefaults = DEFAULT_SETTINGS;

    this.sortableOptions = {
      stop: this.saveToLocalStorage.bind(this),
      start: (e, ui) => {
        console.log(e, ui);
      },
      handle: '> .handle',
      items: "li:not(.is-disabled)"
    };
  }

  $onInit() {
    // TODO: deep validation
    let initStrategy;

    if (this.isDataInLsExists()) {
      initStrategy = 'initFromLocalStorage';
    } else {
      initStrategy = 'initWithDefaults';
    }

    this.baseTime = this.$ls.get('baseTime') || Date.now();
    this.settings = this.$ls.get('settings') || this.settingsDefaults;
    this.choosenInterval = {};
    this[initStrategy]();
  }

  guessTimezone() {}

  initWithDefaults() {
    this.ApiService.getLocations(this.deafults)
      .then(
        locations => {
          this.locations = locations;
          this.setBaseLocation(0);
          this.utcRange = this.DateTimeService.createUtcRange(this.baseTime, this.baseTimeZone);
          this.toggleLoading();
        },
        error => {
          console.log('error loading initial data:', error)
        }
      )
  }

  initFromLocalStorage() {
    this.locations = this.getFromLocalStorage();
    let baseIndex = _.findIndex(this.locations, location => location.isHome);
    this.setBaseLocation(baseIndex);
    this.utcRange = this.DateTimeService.createUtcRange(this.baseTime, this.baseTimeZone);
    this.toggleLoading();
  }

  setRelativeOffsets() {
    this.locations = this.locations.map(location => {
      let tz = location.timezone.timeZoneId;
      location.relativeOffset = this.DateTimeService.getRelativeOffset(tz, this.baseTimeZone);
      return location;
    });
  }

  // TODO: move me please
  isDayBoundary(timestamp, location, boundary) {
    let method = boundary === 'start' ? 'startOf' : 'endOf';

    let tz = location.timezone.timeZoneId;
    let boundaryTime = moment
      .tz(this.baseTime, tz)
      [method]('day')
      .format('H');

    let time = moment.tz(timestamp, tz).format('H');

    return time === boundaryTime;
  }

  initFromUrlState() {}

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
    this.setRelativeOffsets();
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

  isDataInLsExists() {
    return !!(this.$ls.get('locations') && this.$ls.get('locations').length);
  }

  isWeekend(date, tz) {
    return this.DateTimeService.isWeekend(date, tz);
  }

  saveToLocalStorage() {
    this.$ls.set('locations', this.locations);
  }

  getFromLocalStorage() {
    return this.$ls.get('locations');
  }

  sort(direction) {
    let baseIndex = _.findIndex(this.locations, location => location.isHome);

    if (direction === 'up' && baseIndex === 0) return;
    if (direction === 'down' && baseIndex === this.locations.length - 1) return;

    let swapIndex = direction === 'up' ? baseIndex - 1 : baseIndex + 1;
    let b = this.locations[swapIndex];
    this.locations[swapIndex] = this.locations[baseIndex];
    this.locations[baseIndex] = b;
    this.saveToLocalStorage();
  };
}

const componentDefinition = {
  templateUrl: 'app/components/app/app.template.html',
  controller: Controller
};

angular
  .module('appConverter')
  .component('app', componentDefinition);