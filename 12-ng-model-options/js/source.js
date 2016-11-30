var ngModelOptionsDirective = ['$modelOptions', function($modelOptions) {
  return {
    restrict: 'A',
    // ngModelOptions needs to run before ngModel and input directives
    priority: 10,
    require: ['ngModelOptions', '?^^ngModelOptions'],
    controller: function NgModelOptionsController() {},
    link: {
      pre: function ngModelOptionsPreLinkFn(scope, element, attrs, ctrls) {
        var optionsCtrl = ctrls[0];
        var parentOptions = ctrls[1] ? ctrls[1].$options : $modelOptions;
        optionsCtrl.$options = parentOptions.createChild(scope.$eval(attrs.ngModelOptions));
      }
    }
  };
}];

// From ng/directive/ngModel.js
post: function ngModelPostLink(scope, element, attr, ctrls) {
  var modelCtrl = ctrls[0];
  if (modelCtrl.$options.getOption('updateOn')) {
    element.on(modelCtrl.$options.getOption('updateOn'), function(ev) {
      modelCtrl.$$debounceViewValueCommit(ev && ev.type);
    });
  }
  // ...etc...
}

$$debounceViewValueCommit: function(trigger) {
    var debounceDelay = this.$options.getOption('debounce');

    if (isNumber(debounceDelay[trigger])) {
      debounceDelay = debounceDelay[trigger];
    } else if (isNumber(debounceDelay['default'])) {
      debounceDelay = debounceDelay['default'];
    }

    this.$$timeout.cancel(this.$$pendingDebounce);
    var that = this;
    if (debounceDelay > 0) { // this fails if debounceDelay is an object
      this.$$pendingDebounce = this.$$timeout(function() {
        that.$commitViewValue();
      }, debounceDelay);
    } else if (this.$$scope.$root.$$phase) {
      this.$commitViewValue();
    } else {
      this.$$scope.$apply(function() {
        that.$commitViewValue();
      });
    }
  }
