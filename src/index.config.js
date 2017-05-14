angular
  .module('appConverter')
  .config(configLocalStorage);

function configLocalStorage(localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('time_converter');
}
