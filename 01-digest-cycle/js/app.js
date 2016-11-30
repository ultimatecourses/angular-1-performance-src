angular
  .module('app', [])
  .run(function ($rootScope, $timeout) {
    var count = 0;
    $rootScope.$watch(function () {
      console.log('$digest count', ++count);
    });

    $rootScope.$watch('enabled', function(val) {
      console.log('You are now: ' + (val ? 'enabled' : 'disabled'));
    });

    $rootScope.enabled = true;
    $timeout(function() { $rootScope.enabled = false }, 2000);
    $timeout(function() { $rootScope.enabled = true }, 4000);
  });
