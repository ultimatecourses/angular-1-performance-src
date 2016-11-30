var useApplyAsync = false;
 /**
  * @ngdoc method
  * @name $httpProvider#useApplyAsync
  * @description
  *
  * Configure $http service to combine processing of multiple http responses received at around
  * the same time via {@link ng.$rootScope.Scope#$applyAsync $rootScope.$applyAsync}. This can result in
  * significant performance improvement for bigger applications that make many HTTP requests
  * concurrently (common during application bootstrap).
  *
  * Defaults to false. If no value is specified, returns the current configured value.
  *
  * @param {boolean=} value If true, when requests are loaded, they will schedule a deferred
  *    "apply" on the next tick, giving time for subsequent requests in a roughly ~10ms window
  *    to load and share the same digest cycle.
  *
  * @returns {boolean|Object} If a value is specified, returns the $httpProvider for chaining.
  *    otherwise, returns the current configured value.
  **/
this.useApplyAsync = function(value) {
 if (isDefined(value)) {
   useApplyAsync = !!value;
   return this;
 }
 return useApplyAsync;
};

function createApplyHandlers(eventHandlers) {
  if (eventHandlers) {
    var applyHandlers = {};
    forEach(eventHandlers, function(eventHandler, key) {
      applyHandlers[key] = function(event) {
        if (useApplyAsync) {
          $rootScope.$applyAsync(callEventHandler);
        } else if ($rootScope.$$phase) {
          callEventHandler();
        } else {
          $rootScope.$apply(callEventHandler);
        }

        function callEventHandler() {
          eventHandler(event);
        }
      };
    });
    return applyHandlers;
  }
}


/**
 * Callback registered to $httpBackend():
 *  - caches the response if desired
 *  - resolves the raw $http promise
 *  - calls $apply
 */
function done(status, response, headersString, statusText) {
  if (cache) {
    if (isSuccess(status)) {
      cache.put(url, [status, response, parseHeaders(headersString), statusText]);
    } else {
      // remove promise from the cache
      cache.remove(url);
    }
  }

  function resolveHttpPromise() {
    resolvePromise(response, status, headersString, statusText);
  }

  if (useApplyAsync) {
    $rootScope.$applyAsync(resolveHttpPromise);
  } else {
    resolveHttpPromise();
    if (!$rootScope.$$phase) $rootScope.$apply();
  }
}
