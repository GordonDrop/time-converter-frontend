// TODO: maybe key nav?
// const KEYS = {
//   UP: 38,
//   DOWN: 40,
//   ENTER: 13
// };

class Controller {
  constructor(
    ApiService,
    localStorageService,
    DateTimeService
  ) {
    this.ApiService = ApiService;
    this.$ls = localStorageService;
    this.loading = false;
    this.DateTimeService = DateTimeService;
    this.searchResults = [];
    this.searchResultsEmpty = false;
    this.lastSearch = Date.now();
  }

  onChange() {
    if (this.query.length === 0) {
      this.searchResults = [];
      return;
    }

    if (this.query.length < 2) return;

    // debounce request
    if (Date.now() > this.lastSearch + 1000) {
      this.lastSearch = Date.now();
      this.searchRequest();
    }
  }

  searchRequest() {
    this.toggleLoading();
    this.searchResultsEmpty = false;

    this.ApiService.searchLocations({q: this.query})
      .then(locations => {
        this.searchResults = locations;
        this.searchResultsEmpty = this.searchResults.length < 1;
        this.searchTime = Date.now();
      });
  }

  hideList() {
    this.searchResults = [];
    this.searchResultsEmpty = false;
  }

  toggleLoading() {
    this.loading = !this.loading;
  }

  addLocation(location) {
    // TODO: if locations are equal and isHome, than both should be home
    let tz = location.timezone.timeZoneId;
    location.relativeOffset = this.DateTimeService.getRelativeOffset(tz, this.baseTz);
    this.locations.push(location);
    this.$ls.set('locations', this.locations);
    this.hideList();
  }
}

const componentDefinition = {
  templateUrl: 'app/components/search-locations/search-locations.template.html',
  controller: Controller,
  bindings: {
    locations: '=',
    baseTz: '<'
  }
};

angular
  .module('appConverter')
  .component('searchLocations', componentDefinition);