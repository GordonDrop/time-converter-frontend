angular
  .module('appConverter')
  .factory('ApiService', ApiService);

function ApiService($http) {
  return {
    getLocations: getLocations
  };

  function requestUrl(endpoint) {
    const BASE_URL = 'http://localhost:5000/api';
    return BASE_URL + endpoint;
  }

  function getLocations(locationsList) {
    let config = {
      params: { q: locationsList }
    };

    return $http.get(requestUrl('/locations'), config)
      .then(response => response.data);
  }
}