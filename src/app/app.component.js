class AppController {
  constructor() {
    this.hello = 'Hello world!';
    this.name = 'Mazafaka';
  }
}

const componentDefinition = {
  templateUrl: 'app/app.template.html',
  controller: AppController
};

angular
  .module('app')
  .component('app', componentDefinition);