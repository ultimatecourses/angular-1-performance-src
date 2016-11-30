function FirstCtrl($scope) {
  $scope.$watch('count',
    function (newValue, oldValue) {
      console.log('=> firstCtrl.count', newValue)
    }
  );
}

function SecondCtrl($scope) {
  $scope.$watch('count',
    function (newValue, oldValue) {
      console.log('=> secondCtrl.count', newValue)
    }
  );
}

angular
  .module('app', [])
  .run(function($rootScope, $timeout) {
    $rootScope.count = 10;

    $rootScope.$watch('count', function (newValue, oldValue) {
      console.log('$rootScope.count', newValue)
    });

    $timeout(function() { $rootScope.count = 100 }, 2000);
    $timeout(function() { $rootScope.count = 1000 }, 4000);
    $timeout(function() { $rootScope.count = 10000 }, 6000);
  })
  .controller('firstCtrl', FirstCtrl)
  .controller('secondCtrl', SecondCtrl);
