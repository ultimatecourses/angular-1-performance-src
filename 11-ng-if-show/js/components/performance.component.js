var performance = {
  bindings: {},
  template: `
  <h1>ng-if vs ng-show</h1>
  <div class="container">
    <hr>
    <button ng-click="$ctrl.toggleTop()">Toggle Top</button>
    <button ng-click="$ctrl.toggleBottom()">Toggle Bottom</button>
    <hr>
    <header class="component" ng-show="$ctrl.showTop"></header>
    <content class="component" ng-if="$ctrl.showBottom"></content>
  </div>
  `,
  controller: function PerformanceController() {
    this.showTop = true;
    this.showBottom = true;

    this.toggleTop = function() {
      this.showTop = !this.showTop;
    }

    this.toggleBottom = function() {
      this.showBottom = !this.showBottom;
    }
  }
};

angular
  .module('app')
  .component('performance', performance);
