var counter = {
  template: `
    <div class="counter">
      <button ng-click="$ctrl.decrement();">-</button>
      <input type="text" ng-model="$ctrl.count">
      <button ng-click="$ctrl.increment();">+</button>
    </div>
  `,
  controller: ['CounterService', function (CounterService) {
    this.$onInit = function () {
      this.count = CounterService.getInitialCount();
    };
    this.increment = function () {
      this.count = CounterService.incrementCount(this.count);
    };
    this.decrement = function () {
      this.count = CounterService.decrementCount(this.count);
    };
  }]
};

angular
  .module('app')
  .component('counter', counter);
