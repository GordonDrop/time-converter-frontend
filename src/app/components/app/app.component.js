// TODO: autocomplete
// TODO: add range picker
// TODO: baseTime picker
// TODO: url logic initialization
// TODO: settings
// TODO: change time format
// TODO: add pwa

class Controller {
  constructor(
    DEFAULT_TIMEZONES,
    ApiService,
    DateTimeService,
    localStorageService
  ) {
    this.deafults = DEFAULT_TIMEZONES;
    this.ApiService = ApiService;
    this.DateTimeService = DateTimeService;
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
    // TODO: deep validation
    let savedLocations = this.getFromLocalStorage();
    let initStrategy;

    if (savedLocations) {
      initStrategy = 'setFromLocalStorage';
    } else {
      initStrategy = 'setDefaults';
    }

    this[initStrategy]();
  }

  guessTimezone() {}

  setDefaults() {
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

  setFromLocalStorage() {
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

  saveToLocalStorage() {
    this.$ls.set('locations', this.locations);
  }

  getFromLocalStorage() {
    return this.$ls.get('locations');
  }
}

const componentDefinition = {
  templateUrl: 'app/components/app/app.template.html',
  controller: Controller
};

angular
  .module('appConverter')
  .component('app', componentDefinition);