var debugInfoEnabled = true;
this.debugInfoEnabled = function(enabled) {
  if (isDefined(enabled)) {
    debugInfoEnabled = enabled;
    return this;
  }
  return debugInfoEnabled;
};

if (config.debugInfoEnabled) {
  // Pushing so that this overrides `debugInfoEnabled` setting defined in user's `modules`.
  modules.push(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
  }]);
}

compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
  var bindings = $element.data('$binding') || [];

  if (isArray(binding)) {
    bindings = bindings.concat(binding);
  } else {
    bindings.push(binding);
  }

  $element.data('$binding', bindings);
} : noop;

compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
  safeAddClass($element, 'ng-binding');
} : noop;

compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
  var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
  $element.data(dataName, scope);
} : noop;

compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
  safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
} : noop;

compile.$$createComment = function(directiveName, comment) {
  var content = '';
  if (debugInfoEnabled) {
    content = ' ' + (directiveName || '') + ': ';
    if (comment) content += comment + ' ';
  }
  return window.document.createComment(content);
};
