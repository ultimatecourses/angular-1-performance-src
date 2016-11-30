function Scope() {
  this.$id = nextUid();
  this.$$phase = this.$parent = this.$$watchers =
    this.$$nextSibling = this.$$prevSibling =
      this.$$childHead = this.$$childTail = null;
  this.$root = this;
  this.$$destroyed = false;
  this.$$listeners = {};
  this.$$listenerCount = {};
  this.$$watchersCount = 0;
  this.$$isolateBindings = null;
}

function incrementWatchersCount(current, count) {
  do {
    current.$$watchersCount += count;
  } while ((current = current.$parent));
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
