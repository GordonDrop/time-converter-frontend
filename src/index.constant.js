angular
  .module('appConverter')
  .constant('DEFAULT_TIMEZONES',
    ['Europe/London', 'Africa/Cairo', 'Europe/Moscow']
  )
  .constant('DEFAULT_SETTINGS', {
    weekends: { value: false, label: 'Show weekends' },
    timezones: { value: true, label: 'Show timezones' },
  })
  .constant('DEFAULT_INTERVAL', { start: 0, end: 30 });
