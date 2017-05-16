class Controller {
  constructor(DateTimeService) {
    this.DateTimeService = DateTimeService;
  }

  copyToClipboard() {
    let tempTextarea = $('<textarea>');
    let choosenTimeText = this.DateTimeService.formatChooseTime(this.choosenInterval, this.locations);
    $('body').append(tempTextarea);


    tempTextarea.val(choosenTimeText).select();
    document.execCommand("copy");
    tempTextarea.remove();
  }

  shareViaGoogleCalendar() {

  }
}

const componentDefinition = {
  templateUrl: 'app/components/share-time-controls/share-time-controls.template.html',
  bindings: {
    choosenInterval: '<',
    locations: '<',
  },
  controller: Controller
};

angular
  .module('appConverter')
  .component('shareTimeControls', componentDefinition);