angular
  .module('appConverter')
  .factory('ApiService', ApiService);

function ApiService($http) {
  return {
    getLocations: getLocations,
    searchLocations: searchLocations,
    formatTimezone: formatTimezone
  };

  function requestUrl(endpoint) {
    const BASE_URL = 'http://localhost:5000/api';
    return BASE_URL + endpoint;
  }

  function formatTimezone(locations) {
    return locations.data.map(location => {
      location.timezone.abbr = moment.tz(location.timezone.timeZoneId).zoneAbbr();
      return location;
    })
  }

  function getLocations(locationsList) {
    let config = {
      params: { q: locationsList }
    };

    return $http.get(requestUrl('/locations'), config)
      .then(formatTimezone);
  }

  function searchLocations(params) {
    let config = {
      params: params
    };

    return $http.get(requestUrl('/locations-search'), config)
      .then(formatTimezone);
  }
}