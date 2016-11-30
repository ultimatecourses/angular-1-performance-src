function trackDigests($rootScope) {
  function link($scope, $element, $attrs) {
    var count = 0;
    function update() {
      count++;
      $element.text('$digests: ' + count);
      console.log('$digest', count);
    }
    // Use internal angular $$postDigest helper
    // purely to avoid using a $watch which
    // would cause a double increment in count
    (function registerPostDigestHook() {
      $rootScope.$$postDigest(function () {
        update();
        setTimeout(registerPostDigestHook);
      });
    })();
  }
  return {
    restrict: 'EA',
    link: link
  };
}

angular
  .module('app')
  .directive('trackDigests', trackDigests);
