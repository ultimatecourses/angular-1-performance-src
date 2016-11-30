$evalAsync: function(expr, locals) {
  // if we are outside of an $digest loop and this is the first time we are scheduling async
  // task also schedule async auto-flush
  if (!$rootScope.$$phase && !asyncQueue.length) {
    $browser.defer(function() {
      if (asyncQueue.length) {
        $rootScope.$digest();
      }
    });
  }

  asyncQueue.push({scope: this, expression: $parse(expr), locals: locals});
}

$applyAsync: function(expr) {
  var scope = this;
  if (expr) {
    applyAsyncQueue.push($applyAsyncExpression);
  }
  expr = $parse(expr);
  scheduleApplyAsync();

  function $applyAsyncExpression() {
    scope.$eval(expr);
  }
}

function scheduleApplyAsync() {
  if (applyAsyncId === null) {
    applyAsyncId = $browser.defer(function() {
      $rootScope.$apply(flushApplyAsync);
    });
  }
}

$$postDigest: function(fn) {
  postDigestQueue.push(fn);
}

// Inside $digest
// postDigestQueuePosition isn't local here because this loop can be reentered recursively.
while (postDigestQueuePosition < postDigestQueue.length) {
  try {
    postDigestQueue[postDigestQueuePosition++]();
  } catch (e) {
    $exceptionHandler(e);
  }
}
postDigestQueue.length = postDigestQueuePosition = 0;
