class Controller {
  constructor($element) {
    this.$el = $element;
    this.choosing = false;
  }

  $onInit() {
    this.init();
    this.bindEvents();
  }

  init() {
    this.$overlay = angular.element(this.$el).find('.range-picker-overlay');
    this.$handle = angular.element(this.$el).find('.range-picker-handle');
    this.$elWidth = this.$overlay.width();
    this.intervals = 46;
    this.hourIntervals = 24;
    this.intervalWidth = Math.floor(this.$elWidth/this.intervals);
    this.cellWidth = Math.floor(this.$elWidth/this.hourIntervals);

    this.setDefaults();
  }

  $onDestroy() {
    this.unbindEvents()
  }

  bindEvents() {
    this.$overlay.on('mouseenter.rangePicker', () => {
      this.$overlay.on('mousemove.rangePicker', this.followMouse.bind(this));
    });

    this.$overlay.on('mouseleave.rangePicker', () => {
      this.$overlay.off('mousemove.rangePicker');
      this.setDefaults();
    });
  }

  clickHandler() {
    if (this.choosing) return;
    this.unbindEvents();
    this.setChoosingState();
    // TODO: set data
  }

  cancelHandler() {
    this.bindEvents();
    this.setDefaults();
  }

  unbindEvents() {
    this.$overlay.off('mouseenter.rangePicker');
    this.$overlay.off('mousemove.rangePicker');
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
      'left': this.cellWidth * 12 + 'px'
    });
  }

  setChoosingState(e) {
    this.choosing = true;

    let positionLeft = this.$handle.position().left;
    let position = positionLeft - positionLeft % this.intervalWidth;

    // lazy hack
    position = position + + this.intervalWidth;

    this.$handle.css({
      'width': this.intervalWidth + 'px',
      'left': position + 'px'
    });
  }
}

const componentDefinition = {
  templateUrl: 'app/components/range-picker/range-picker.template.html',
  bindings: {
    choosenInterval: '<',
    onUpdate: '&'
  },
  controller: Controller
};

angular
  .module('appConverter')
  .component('rangePicker', componentDefinition);