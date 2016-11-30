$watchCollection: function(obj, listener) {
  $watchCollectionInterceptor.$stateful = true;

  var self = this;
  // the current value, updated on each dirty-check run
  var newValue;
  // a shallow copy of the newValue from the last dirty-check run,
  // updated to match newValue during dirty-check run
  var oldValue;
  // a shallow copy of the newValue from when the last change happened
  var veryOldValue;
  // only track veryOldValue if the listener is asking for it
  var trackVeryOldValue = (listener.length > 1);
  var changeDetected = 0;
  var changeDetector = $parse(obj, $watchCollectionInterceptor);
  var internalArray = [];
  var internalObject = {};
  var initRun = true;
  var oldLength = 0;

  function $watchCollectionInterceptor(_value) {
    newValue = _value;
    var newLength, key, bothNaN, newItem, oldItem;

    // If the new value is undefined, then return undefined as the watch may be a one-time watch
    if (isUndefined(newValue)) return;

    if (!isObject(newValue)) { // if primitive
      if (oldValue !== newValue) {
        oldValue = newValue;
        changeDetected++;
      }
    } else if (isArrayLike(newValue)) {
      if (oldValue !== internalArray) {
        // we are transitioning from something which was not an array into array.
        oldValue = internalArray;
        oldLength = oldValue.length = 0;
        changeDetected++;
      }

      newLength = newValue.length;

      if (oldLength !== newLength) {
        // if lengths do not match we need to trigger change notification
        changeDetected++;
        oldValue.length = oldLength = newLength;
      }
      // copy the items to oldValue and look for changes.
      for (var i = 0; i < newLength; i++) {
        oldItem = oldValue[i];
        newItem = newValue[i];

        // eslint-disable-next-line no-self-compare
        bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
        if (!bothNaN && (oldItem !== newItem)) {
          changeDetected++;
          oldValue[i] = newItem;
        }
      }
    } else {
      if (oldValue !== internalObject) {
        // we are transitioning from something which was not an object into object.
        oldValue = internalObject = {};
        oldLength = 0;
        changeDetected++;
      }
      // copy the items to oldValue and look for changes.
      newLength = 0;
      for (key in newValue) {
        if (hasOwnProperty.call(newValue, key)) {
          newLength++;
          newItem = newValue[key];
          oldItem = oldValue[key];

          if (key in oldValue) {
            // eslint-disable-next-line no-self-compare
            bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
            if (!bothNaN && (oldItem !== newItem)) {
              changeDetected++;
              oldValue[key] = newItem;
            }
          } else {
            oldLength++;
            oldValue[key] = newItem;
            changeDetected++;
          }
        }
      }
      if (oldLength > newLength) {
        // we used to have more keys, need to find them and destroy them.
        changeDetected++;
        for (key in oldValue) {
          if (!hasOwnProperty.call(newValue, key)) {
            oldLength--;
            delete oldValue[key];
          }
        }
      }
    }
    return changeDetected;
  }

  function $watchCollectionAction() {
    if (initRun) {
      initRun = false;
      listener(newValue, newValue, self);
    } else {
      listener(newValue, veryOldValue, self);
    }

    // make a copy for the next time a collection is changed
    if (trackVeryOldValue) {
      if (!isObject(newValue)) {
        //primitive
        veryOldValue = newValue;
      } else if (isArrayLike(newValue)) {
        veryOldValue = new Array(newValue.length);
        for (var i = 0; i < newValue.length; i++) {
          veryOldValue[i] = newValue[i];
        }
      } else { // if object
        veryOldValue = {};
        for (var key in newValue) {
          if (hasOwnProperty.call(newValue, key)) {
            veryOldValue[key] = newValue[key];
          }
        }
      }
    }
  }

  return this.$watch(changeDetector, $watchCollectionAction);
}

$watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
  var get = $parse(watchExp);

  if (get.$$watchDelegate) {
    return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
  }
  var scope = this,
    array = scope.$$watchers,
    watcher = {
      fn: listener,
      last: initWatchVal,
      get: get,
      exp: prettyPrintExpression || watchExp,
      eq: !!objectEquality
    };

  lastDirtyWatch = null;

  if (!isFunction(listener)) {
    watcher.fn = noop;
  }

  if (!array) {
    array = scope.$$watchers = [];
  }
  // we use unshift since we use a while loop in $digest for speed.
  // the while loop reads in reverse order.
  array.unshift(watcher);
  incrementWatchersCount(this, 1);

  return function deregisterWatch() {
    if (arrayRemove(array, watcher) >= 0) {
      incrementWatchersCount(scope, -1);
    }
    lastDirtyWatch = null;
  };
}