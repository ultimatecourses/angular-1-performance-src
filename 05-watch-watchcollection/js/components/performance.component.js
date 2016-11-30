var performance = {
  bindings: {},
  template: `
    <h1>
      Scope $watch() vs. $watchCollection() In AngularJS
    </h1>

    <div>
      <button ng-click='$ctrl.changeDeepValue()'>Change Deep Value</button>
      -
      <button ng-click='$ctrl.changeShallowValue()'>Change Shallow Value</button>
      -
      <button ng-click='$ctrl.rebuild()'>Rebuild</button>
      -
      <button ng-click='$ctrl.clear()'>Clear</button>
    </div>

    <h2>
      $watchCollection( collection ) Log
    </h2>

    <ul>
      <li ng-repeat='item in $ctrl.watchCollectionLog'>
        {{ item }}
      </li>
    </ul>

    <h2>
      $watch( collection ) Log
    </h2>

    <ul>
      <li ng-repeat='item in $ctrl.watchLog'>
        {{ item }}
      </li>
    </ul>

    <h2>
      $watch( collection, [ Equality = true ] ) Log
    </h2>

    <ul>
      <li ng-repeat='item in $ctrl.watchEqualityLog'>
        {{ item }}
      </li>
    </ul>
    `,
  controller: function PerformanceController($scope) {
    var ctrl = this;

    ////////////////////////////////////////////////////////
    // Create and rebuild collection we are watching      //
    ////////////////////////////////////////////////////////
    ctrl.collection = [{
      id: 1,
      value: 0
    }];

    ctrl.rebuild = function() {
      ctrl.collection = [{
        id: 1,
        value: 0
      }];
    }

    ////////////////////////////////////////////////////////
    // Helper functions for updating values in collection //
    ////////////////////////////////////////////////////////
    ctrl.now = function() {
      return (new Date()).getTime();
    }

    ctrl.changeDeepValue = function() {
      ctrl.collection[0].value = ctrl.now();
    }

    ctrl.changeShallowValue = function() {
      ctrl.collection.push({
        id: ctrl.collection.length + 1,
        value: ctrl.now()
      });
    }

    ////////////////////////////////////////////////////////
    // Manage logging for our various watchers            //
    ////////////////////////////////////////////////////////
    ctrl.watchCollectionLog = [];
    ctrl.watchLog = [];
    ctrl.watchEqualityLog = [];

    ctrl.clear = function() {
      ctrl.watchCollectionLog = [];
      ctrl.watchLog = [];
      ctrl.watchEqualityLog = [];
    }

    ctrl.addLogItem = function(log) {
      var logItem = (
        'Executed: ' + ctrl.now() + '( length: ' + ctrl.collection.length +')'
      );

      log.splice(0, 0, logItem);
    }

    ////////////////////////////////////////////////////////
    // Initialize our watchers in the $onInit method      //
    ////////////////////////////////////////////////////////
    ctrl.$onInit = function() {

      $scope.$watchCollection(
        function() {
          return ctrl.collection;
        },
        function(newValue, oldValue) {
          ctrl.addLogItem(ctrl.watchCollectionLog);
        }
      )

      $scope.$watch(
        function() {
          return ctrl.collection;
        },
        function(newValue, oldValue) {
          ctrl.addLogItem(ctrl.watchLog);
        }
      )

      $scope.$watch(
        function() {
          return ctrl.collection;
        },
        function(newValue, oldValue) {
          ctrl.addLogItem(ctrl.watchEqualityLog);
        },
        true
      )

    }
  }
};

angular
  .module('app')
  .component('performance', performance);
