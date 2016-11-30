function testFilter() {
  var filterCount = 0;
  return function (values) {
    return values.map(function (value) {
      filterCount++;
      // don't do this, this is just a hack to inject
      // the filter count into the DOM
      // without forcing another $digest
      document.querySelector('.filterCount').innerHTML = (
        'Filter count: ' + filterCount
      );
      return value;
    });
  };
}

angular
  .module('app')
  .filter('testFilter', testFilter);
