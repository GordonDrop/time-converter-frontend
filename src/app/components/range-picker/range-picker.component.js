class Controller {
  constructor($element, $timeout, DateTimeService) {
    this.$el = $element;
    this.$timeout = $timeout;
    this.DateTimeService = DateTimeService;
  }

  $onInit() {
    this.init();
    this.bindMoveEvents();
  }

  init() {
    this.draging = false;
    this.$overlay = angular.element(this.$el).find('.range-picker-overlay');
    this.$handle = angular.element(this.$el).find('.range-picker-handle');
    this.$handleLeft = angular.element(this.$el).find('.range-picker-handle-overlay-left');
    this.$handleRight = angular.element(this.$el).find('.range-picker-handle-overlay-right');
    this.$elWidth = this.$overlay.width();

    this.intervals = 46;
    this.hourIntervals = 24;
    this.intervalWidth = Math.floor(this.$elWidth/this.intervals);
    this.cellWidth = Math.floor(this.$elWidth/this.hourIntervals);

    this.setDefaults();
  }

  $onDestroy() {
    this.unbindMoveEvents()
  }

  bindMoveEvents() {
    this.$overlay.on('mouseenter.rangePicker', () => {
      $(document).on('mousemove.rangePicker', this.followMouse.bind(this));
    });

    this.$overlay.on('mouseleave.rangePicker', () => {
      $(document).off('mousemove.rangePicker');
      this.setDefaults();
    });
  }

  clickHandler(e) {
    e.preventDefault();
    if (this.choosing) return;
    this.unbindMoveEvents();
    this.setChoosingState(e);
    this.updateData();
  }

  cancelHandler() {
    if (this.draging) return;
    console.log('canceled');
    this.bindMoveEvents();
    this.setDefaults();
  }

  unbindMoveEvents() {
    $(document).off('mousemove.rangePicker');
    this.$overlay.off('mouseenter.rangePicker');
    this.$overlay.off('mouseleave.rangePicker');
  }

  followMouse(e) {
    let box = this.$overlay;
    let follower = this.$handle;

    let newX = e.pageX - box.offset().left - follower.width() / 2;
    if (newX < 0 || newX > (box.width() - follower.width())) return;

    follower.css({
      left: newX
    });
  }

  setDefaults() {
    this.choosing = false;
    this.$handle.css({
      'width': this.cellWidth + 'px',
      'right': 'auto',
      'left': this.cellWidth * 12 + 'px'
    });
    this.choosenInterval = {};
  }

  setChoosingState(e) {
    this.choosing = true;

    let handleLeft = e.pageX - this.$overlay.offset().left;
    let positionLeft = handleLeft - handleLeft % this.intervalWidth;
    let positionRight = this.$overlay.width() - positionLeft - this.intervalWidth;

    this.$handle.css({
      'width': 'auto',
      'left': positionLeft + 'px',
      'right': positionRight + 'px'
    });

    this.moveOverlays();
  }

  startDrag(e) {
    e.stopPropagation();
    this.draging = true;
    let startPosition = Math.floor(e.pageX);

    $(document).on('mousemove.drag', (e) => {
      e.preventDefault();
      let diffX = Math.abs(startPosition - Math.floor(e.pageX));

      if (diffX >= this.intervalWidth) {
        let direction = this.detectDirection(e.pageX);
        this.moveBorder(direction, Math.floor(e.pageX));
        this.moveOverlays();
        startPosition = Math.floor(e.pageX);
        // dirty hack -> $digest :-(
        this.$timeout(this.updateData.bind(this), 0);
      }
    });

    this.$overlay.on('mouseleave.drag', this.endDrag.bind(this));
    $(document).on('mouseup.drag', this.endDrag.bind(this));
  }

  moveBorder(direction, mouseX) {
    let newX;
    if (direction === 'right') {
      let leftPosition = this.$overlay.offset().left + this.$overlay.outerWidth();
      newX = leftPosition - mouseX;
    } else {
      newX = mouseX - this.$overlay.offset().left;
    }

    newX = Math.floor(Math.abs(newX)/this.intervalWidth)*this.intervalWidth;

    this.$handle.css(direction, newX);
  }

  moveOverlays() {
    let positionOfLeft = this.$overlay.outerWidth() - this.$handle.position().left;
    let positionOfRight = this.$handle.position().left + this.$handle.outerWidth();

    this.$handleLeft.css({
      'right': positionOfLeft + 'px'
    });

    this.$handleRight.css({
      'left': positionOfRight + 'px'
    });
  }

  detectDirection(mouseX) {
    let handleMiddleX = this.$handle.offset().left + this.$handle.outerWidth() / 2;
    return handleMiddleX > mouseX ? 'left' : 'right';
  }

  updateData() {
    let dayStart = moment.tz(this.baseTime, this.baseTz).startOf('day').valueOf();
    let halfHoursMilliseconds = 30 * 60 * 1000;
    let start = parseInt(this.$handle.position().left / this.intervalWidth);
    let end = start + parseInt(this.$handle.outerWidth() / this.intervalWidth);
    let duration = (end - start) * 30;

    // converting to minutes
    this.choosenInterval = {
      start: dayStart + start * halfHoursMilliseconds,
      end: dayStart + end * halfHoursMilliseconds,
      duration: this.DateTimeService.getDurationString(duration)
    };
    console.log(this.choosenInterval);
  }

  endDrag() {
    console.log('endDrag');
    $(document).off('mousemove.drag');
    $(document).off('mouseup.drag');
    this.$overlay.off('mouseleave.drag');
    this.draging = false;
  }
}

const componentDefinition = {
  templateUrl: 'app/components/range-picker/range-picker.template.html',
  bindings: {
    choosenInterval: '=',
    choosing: '=',
    baseTime: '<',
    baseTz: '<'
  },
  controller: Controller
};

angular
  .module('appConverter')
  .component('rangePicker', componentDefinition);