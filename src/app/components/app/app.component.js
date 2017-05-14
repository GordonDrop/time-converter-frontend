class AppController {
  constructor(
    DEFAULT_TIMEZONES,
    ApiService,
    localStorageService
  ) {
    'ngInject';

    this.deafults = DEFAULT_TIMEZONES;
    this.ApiService = ApiService;
    this.$ls = localStorageService;
    this.loading = true;

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
    this.saveToLocalStorage();
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
    let isHome = this.locations[locationIndex];

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

  timeRange(value) {
    return _.range(value);
  }
}

const componentDefinition = {
  templateUrl: 'app/components/app/app.template.html',
  controller: AppController
};

angular
  .module('appConverter')
  .component('app', componentDefinition);