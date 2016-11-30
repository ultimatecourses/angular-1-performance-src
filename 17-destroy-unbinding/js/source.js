var ngIfDirective = ['$animate', '$compile', function($animate, $compile) {
  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function($scope, $element, $attr, ctrl, $transclude) {
      var block, childScope, previousElements;
      $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {

        if (value) {
          if (!childScope) {
            $transclude(function(clone, newScope) {
              childScope = newScope;
              clone[clone.length++] = $compile.$$createComment('end ngIf', $attr.ngIf);
              // Note: We only need the first/last node of the cloned nodes.
              // However, we need to keep the reference to the jqlite wrapper as it might be changed later
              // by a directive with templateUrl when its template arrives.
              block = {
                clone: clone
              };
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        } else {
          if (previousElements) {
            previousElements.remove();
            previousElements = null;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          if (block) {
            previousElements = getBlockNodes(block.clone);
            $animate.leave(previousElements).then(function() {
              previousElements = null;
            });
            block = null;
          }
        }
      });
    }
  };
}];

// From ng/rootScope.js
$destroy: function() {
 // We can't destroy a scope that has been already destroyed.
 if (this.$$destroyed) return;
 var parent = this.$parent;

 this.$broadcast('$destroy');

 // ...etc...
}

// From node link function in ng/compile.js
if (isFunction(controllerInstance.$onDestroy)) {
   controllerScope.$on('$destroy', function callOnDestroyHook() {
     controllerInstance.$onDestroy();
   });
 }
