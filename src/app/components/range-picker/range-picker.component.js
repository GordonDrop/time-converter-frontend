class Controller {
  constructor($element) {
    this.$el = $element;
    this.choosing = false;
    this.draging = false;
  }

  $onInit() {
    this.init();
    this.bindMoveEvents();
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
    // TODO: set data
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

    // TODO: UPDATE DATA
  }

  startDrag(e, direction) {
    e.stopPropagation();
    this.draging = true;
    let startPosition = e.pageX;

    $(document).on('mousemove.drag', (e) => {
      e.preventDefault();
      let diffX = Math.floor(Math.abs(startPosition - e.pageX));
      let newX;
      // TODO: add side switching
      // TODO: interval treshold check
      // TODO: add data sync
      // TODO: borders check
      if (direction === 'right') {
        let leftPosition = this.$overlay.offset().left + this.$overlay.outerWidth();
        newX = leftPosition - e.pageX;
      } else {
        newX = e.pageX - this.$overlay.offset().left;
      }

      newX = Math.floor(Math.abs(newX));
      this.$handle.css(direction, newX);
    });

    this.$overlay.on('mouseleave.drag', this.endDrag.bind(this));
    $(document).on('mouseup.drag', this.endDrag.bind(this));
  }

  endDrag() {
    console.log('endDrag');
    $(document).off('mousemove.drag');
    $(document).off('mouseup.drag');
    $(this.$overlay).off('mouseleave.drag');
    this.draging = false;
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