function CounterService() {
  this.getInitialCount = function () {
    return 0;
  };
  this.incrementCount = function (count) {
    return count + 1;
  };
  this.decrementCount = function (count) {
    return count - 1;
  };
}

angular
  .module('app')
  .service('CounterService', CounterService);
