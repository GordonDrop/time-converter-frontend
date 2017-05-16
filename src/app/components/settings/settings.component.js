class Controller {
  constructor(localStorageService) {
    this.$ls = localStorageService;
  }

  toggle(settingsItem) {
    settingsItem.value = !settingsItem.value;
    this.$ls.set('settings', this.settings);
  }
}

const componentDefinition = {
  templateUrl: 'app/components/settings/settings.template.html',
  bindings: {
    settings: '='
  },
  controller: Controller
};

angular
  .module('appConverter')
  .component('settings', componentDefinition);