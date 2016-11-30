var performance = {
  bindings: {},
  template: `
  <h1>Using $onDestroy</h1>
  <div class="container">
    <hr>
    <button ng-click="$ctrl.toggleContent()">Toggle Content</button>
    <hr>
    <content class="component" ng-if="$ctrl.showContent"></content>  
  </div>
  `,
  controller: function PerformanceController() {
    this.showContent = true;

    this.toggleContent = function() {
      this.showContent = !this.showContent;
    }
  }
};

angular
  .module('app')
  .component('performance', performance);