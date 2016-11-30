var performance = {
  bindings: {},
  template: `
    <h1 track-digests></h1>
    <div><strong>Standard ngModel</strong></div>
    <input type="text" ng-model="$ctrl.firstName">
    <br><br>
    <div><strong>Optimized with ngModelOptions</strong></div>
    <input type="text" ng-model="$ctrl.lastName" ng-model-options="{
      'updateOn': 'default blur',
      'debounce': {
        'default': 1000,
        'blur': 0
      }
    }">
    `,
  controller: function PerformanceController($rootScope) {
    this.$onInit = function() {
      this.firstName = 'Todd';
      this.lastName = 'Motto';
    }
  }
};

angular
  .module('app')
  .component('performance', performance);
