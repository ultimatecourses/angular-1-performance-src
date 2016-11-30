var performance = {
  bindings: {},
  template: `
    <h1>$applyAsync vs $evalAsync</h1>
    `,
  controller: function PerformanceController($scope) {
    var ctrl = this;
    ctrl.name = 'Motto!';
    // $scope.$apply(function() { console.log('APPLY FIRED!')});
    $scope.$applyAsync(function() { console.log('APPLY ASYNC FIRED!')});
    $scope.$evalAsync(function() { console.log('EVAL ASYNC FIRED!')});

    $scope.$watch(
      function() {
        return ctrl.name
      },
      function(newValue, oldValue, scope) {

        $scope.$evalAsync(function(scope) {
          console.log('$evalAsync executed');
          ctrl.name = 'Todd!';
        });


        $scope.$applyAsync(function(scope) {
          console.log('$applyAsync executed');
          ctrl.name = 'Todd!';
        });
      }
    );

    $scope.$$postDigest(function() {
      console.log('$$postDigest executed. Digest completed');
      console.log(ctrl.name);
    });
  }
};

angular
  .module('app')
  .component('performance', performance);
