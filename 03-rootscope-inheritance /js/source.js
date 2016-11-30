$new: function(isolate, parent) {
  var child;

  parent = parent || this;

  if (isolate) {
    child = new Scope();
    child.$root = this.$root;
  } else {
    // Only create a child scope class if somebody asks for one,
    // but cache it to allow the VM to optimize lookups.
    if (!this.$$ChildScope) {
      this.$$ChildScope = createChildScopeClass(this);
    }
    child = new this.$$ChildScope();
  }
  child.$parent = parent;
  child.$$prevSibling = parent.$$childTail;
  if (parent.$$childHead) {
    parent.$$childTail.$$nextSibling = child;
    parent.$$childTail = child;
  } else {
    parent.$$childHead = parent.$$childTail = child;
  }

  // When the new scope is not isolated or we inherit from `this`, and
  // the parent scope is destroyed, the property `$$destroyed` is inherited
  // prototypically. In all other cases, this property needs to be set
  // when the parent scope is destroyed.
  // The listener needs to be added after the parent is set
  if (isolate || parent !== this) child.$on('$destroy', destroyChildScope);

  return child;
}

function createChildScopeClass(parent) {
  function ChildScope() {
    this.$$watchers = this.$$nextSibling =
      this.$$childHead = this.$$childTail = null;
    this.$$listeners = {};
    this.$$listenerCount = {};
    this.$$watchersCount = 0;
    this.$id = nextUid();
    this.$$ChildScope = null;
  }
  ChildScope.prototype = parent;
  return ChildScope;
}