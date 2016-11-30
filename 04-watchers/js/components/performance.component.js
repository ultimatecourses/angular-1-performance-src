var performance = {
  bindings: {},
  template: `
    <h1>Watcher Count: {{$ctrl.watcherCount}}</h1>
    <button ng-click="$ctrl.add()">Add Item</button>
    <div ng-repeat="item in $ctrl.collection">{{item.title}}</div>
    `,
  controller: function PerformanceController($scope, Utils) {
    var ctrl = this;
    ctrl.watcherCount = 0;
    ctrl.collection = [];

    ctrl.$onInit = function() {
      ctrl.watcherCount = Utils.getWatchers().length;
    }

    ctrl.add = function() {
      var id = Math.random().toString(16).slice(10);
      ctrl.collection.push({
        "userId": 1,
        "id": id,
        "title": "(#" + id + ") Todo item",
        "completed": false
      });
    }

    $scope.$watch(
      function() {
        return Utils.getWatchers().length;
      },
      function (newValue, oldValue) {
        ctrl.watcherCount = newValue;
        console.log('ctrl.watcherCount', newValue);
        console.log($scope.$$watchers);
      }
    );
  }
};

angular
  .module('app')
  .component('performance', performance);
