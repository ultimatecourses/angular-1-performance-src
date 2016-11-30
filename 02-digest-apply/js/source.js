$digest: function() {
  var watch, value, last, fn, get,
    watchers,
    length,
    dirty, ttl = TTL,
    next, current, target = this,
    watchLog = [],
    logIdx, asyncTask;

  beginPhase('$digest');
  // Check for changes to browser url that happened in sync before the call to $digest
  $browser.$$checkUrlChange();

  if (this === $rootScope && applyAsyncId !== null) {
    // If this is the root scope, and $applyAsync has scheduled a deferred $apply(), then
    // cancel the scheduled $apply and flush the queue of expressions to be evaluated.
    $browser.defer.cancel(applyAsyncId);
    flushApplyAsync();
  }

  lastDirtyWatch = null;

  do { // "while dirty" loop
    dirty = false;
    current = target;

    // It's safe for asyncQueuePosition to be a local variable here because this loop can't
    // be reentered recursively. Calling $digest from a function passed to $applyAsync would
    // lead to a '$digest already in progress' error.
    for (var asyncQueuePosition = 0; asyncQueuePosition < asyncQueue.length; asyncQueuePosition++) {
      try {
        asyncTask = asyncQueue[asyncQueuePosition];
        asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
      } catch (e) {
        $exceptionHandler(e);
      }
      lastDirtyWatch = null;
    }
    asyncQueue.length = 0;

    traverseScopesLoop:
      do { // "traverse the scopes" loop
        if ((watchers = current.$$watchers)) {
          // process our watches
          length = watchers.length;
          while (length--) {
            try {
              watch = watchers[length];
              // Most common watches are on primitives, in which case we can short
              // circuit it with === operator, only when === fails do we use .equals
              if (watch) {
                get = watch.get;
                if ((value = get(current)) !== (last = watch.last) &&
                  !(watch.eq
                    ? equals(value, last)
                    : (isNumberNaN(value) && isNumberNaN(last)))) {
                  dirty = true;
                  lastDirtyWatch = watch;
                  watch.last = watch.eq ? copy(value, null) : value;
                  fn = watch.fn;
                  fn(value, ((last === initWatchVal) ? value : last), current);
                  if (ttl < 5) {
                    logIdx = 4 - ttl;
                    if (!watchLog[logIdx]) watchLog[logIdx] = [];
                    watchLog[logIdx].push({
                      msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                      newVal: value,
                      oldVal: last
                    });
                  }
                } else if (watch === lastDirtyWatch) {
                  // If the most recently dirty watcher is now clean, short circuit since the remaining watchers
                  // have already been tested.
                  dirty = false;
                  break traverseScopesLoop;
                }
              }
            } catch (e) {
              $exceptionHandler(e);
            }
          }
        }

        // Insanity Warning: scope depth-first traversal
        // yes, this code is a bit crazy, but it works and we have tests to prove it!
        // this piece should be kept in sync with the traversal in $broadcast
        if (!(next = ((current.$$watchersCount && current.$$childHead) ||
          (current !== target && current.$$nextSibling)))) {
          while (current !== target && !(next = current.$$nextSibling)) {
            current = current.$parent;
          }
        }
      } while ((current = next));

    // `break traverseScopesLoop;` takes us to here

    if ((dirty || asyncQueue.length) && !(ttl--)) {
      clearPhase();
      throw $rootScopeMinErr('infdig',
        '{0} $digest() iterations reached. Aborting!\n' +
        'Watchers fired in the last 5 iterations: {1}',
        TTL, watchLog);
    }

  } while (dirty || asyncQueue.length);

  clearPhase();

  // postDigestQueuePosition isn't local here because this loop can be reentered recursively.
  while (postDigestQueuePosition < postDigestQueue.length) {
    try {
      postDigestQueue[postDigestQueuePosition++]();
    } catch (e) {
      $exceptionHandler(e);
    }
  }
  postDigestQueue.length = postDigestQueuePosition = 0;
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

$apply: function(expr) {
  try {
    beginPhase('$apply');
    try {
      return this.$eval(expr);
    } finally {
      clearPhase();
    }
  } catch (e) {
    $exceptionHandler(e);
  } finally {
    try {
      $rootScope.$digest();
    } catch (e) {
      $exceptionHandler(e);
      // eslint-disable-next-line no-unsafe-finally
      throw e;
    }
  }
},