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
    // TODO: ADD other init strataagies
    this.ApiService.getLocations(this.deafults)
      .then(
        response => {
          this.locations = response;
          this.markAsHome(0);
          this.saveToLocalStorage();
          this.toggleLoading();
        },
        error => {
          console.log('error loading initial data:', error)
        }
      )
  }

  guessTimezone() {}

  setDefaults() {}

  setFromLocalStorage() {}

  setSetUrlState() {}

  toggleLoading() {
    this.loading = !this.loading;
  }

  markAsHome(index) {
    this.locations = this.locations.map(location => {
      location.isHome = false;
      return location;
    });

    this.locations[index].isHome = true;
    this.saveToLocalStorage()
  }

  addLocation(location) {
    this.locations.push(location);
    this.saveToLocalStorage();
  }

  removeLocation(locationIndex) {
    let isHome = this.locations[locationIndex];

    this.locations.splice(locationIndex, 1);
    if (isHome) {
      this.markAsHome(0);
    }
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    this.$ls.set('locations', this.locations);
  }

  timeRange() {
    return _.range(24);
  }
}

const componentDefinition = {
  templateUrl: 'app/components/app/app.template.html',
  controller: AppController
};

angular
  .module('appConverter')
  .component('app', componentDefinition);