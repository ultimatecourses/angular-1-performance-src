let performance = {
  bindings: {},
  template: `
  <h1>Limiting Expressions in Templates</h1>
  <div class="element" ng-if="$ctrl.isAdmin && $ctrl.favoriteColor === 'blue' && $ctrl.totalCount > 10">
    Too many expressions in the template! How do you test this?
  </div>

  <div class="element" ng-if="$ctrl.showElement()">
    Extract to a method so that we are not coupled to the template
  </div>

  <div class="element" ng-if="$ctrl.elementShown">
    Store method result so method does not get evaluated every digest cycle
  </div>

  <div class="element" ng-if="::$ctrl.elementShown">
    Bind once and remove from from digest cycle
  </div>

  `,
  controller: function PerformanceController($scope) {
    this.$onInit = function() {
      this.isAdmin = true;
      this.favoriteColor = 'blue';
      this.totalCount = 11;
      this.elementShown = false;

      this.elementShown = this.showElement();
    }
    this.showElement = function() {
      return this.isAdmin && this.favoriteColor === 'blue' && this.totalCount > 10
    }
  }
};

angular
  .module('app')
  .component('performance', performance)
;
