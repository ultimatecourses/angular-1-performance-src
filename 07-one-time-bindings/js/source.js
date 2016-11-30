function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
  var unwatch, lastValue;
  return unwatch = scope.$watch(function oneTimeWatch(scope) {
    return parsedExpression(scope);
  }, function oneTimeListener(value, old, scope) {
    lastValue = value;
    if (isFunction(listener)) {
      listener.apply(this, arguments);
    }
    if (isDefined(value)) {
      scope.$$postDigest(function() {
        if (isDefined(lastValue)) {
          unwatch();
        }
      });
    }
  }, objectEquality);
}

function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
  var unwatch, lastValue;
  return unwatch = scope.$watch(function oneTimeWatch(scope) {
    return parsedExpression(scope);
  }, function oneTimeListener(value, old, scope) {
    lastValue = value;
    if (isFunction(listener)) {
      listener.call(this, value, old, scope);
    }
    if (isAllDefined(value)) {
      scope.$$postDigest(function() {
        if (isAllDefined(lastValue)) unwatch();
      });
    }
  }, objectEquality);

  function isAllDefined(value) {
    var allDefined = true;
    forEach(value, function(val) {
      if (!isDefined(val)) allDefined = false;
    });
    return allDefined;
  }
}
