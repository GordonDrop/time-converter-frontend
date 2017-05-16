angular
  .module('appConverter')
  .constant('DEFAULT_TIMEZONES',
    ['Europe/London', 'Europe/Moscow', 'Asia/Yekaterinburg']
  )
  .constant('DEFAULT_SETTINGS', {
    weekends: { value: false, label: 'Show weekends' },
    timezones: { value: true, label: 'Show timezones' },
  });
