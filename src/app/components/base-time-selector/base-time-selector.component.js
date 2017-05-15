class Controller {
  constructor(
    localStorageService,
    DateTimeService
  ) {
    this.$ls = localStorageService;
    this.DateTimeService = DateTimeService;

    this.isDatepickerOpened = false;
    this.datepickerOptions ={
      showWeeks: false
    };
  }

  $onInit() {
    this.createRange();
    this.dt = this.baseTime;
  }

  createRange() {
    this.daysRange = this.DateTimeService.createWeekRange(this.baseTime);
  }

  isSelected(date) {
    return moment(date).isSame(this.baseTime, 'day');
  }

  isWeekend(date) {
    return this.DateTimeService.isWeekend(date, this.baseTimeZone);
  }

  openDatepicker() {
    this.isDatepickerOpened = true;
  }

  changeDate() {
    this.selectBaseTime(this.dt);
  }

  selectBaseTime(date) {
    this.prevBaseTime = this.baseTime;
    this.baseTime = date;
    this.$ls.set('baseTime', this.baseTime);
    this.hoursRange = this.DateTimeService.createUtcRange(this.baseTime, this.baseTimeZone);
    this.createRange();
  }

  undo(e) {
    e.preventDefault();
    e.stopPropagation();
    this.baseTime = this.prevBaseTime;
    this.$ls.set('baseTime', this.baseTime);
    delete this.prevBaseTime;
    this.hoursRange = this.DateTimeService.createUtcRange(this.baseTime, this.baseTimeZone);

    this.createRange();
  }
}

const componentDefinition = {
  templateUrl: 'app/components/base-time-selector/base-time-selector.template.html',
  controller: Controller,
  bindings: {
    baseTime: '=',
    baseTimeZone: '<',
    hoursRange: '='
  }
};

angular
  .module('appConverter')
  .component('baseTimeSelector', componentDefinition);