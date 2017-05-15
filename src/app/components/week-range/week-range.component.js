class Controller {
  constructor(
    localStorageService,
    DateTimeService
  ) {
    this.$ls = localStorageService;
    this.DateTimeService = DateTimeService;
  }

  $onInit() {
    this.createRange();
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
  templateUrl: 'app/components/week-range/week-range.template.html',
  controller: Controller,
  bindings: {
    baseTime: '=',
    baseTimeZone: '<',
    hoursRange: '='
  }
};

angular
  .module('appConverter')
  .component('weekRange', componentDefinition);