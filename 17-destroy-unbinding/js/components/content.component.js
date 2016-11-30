var content = {
  bindings: {},
  template: `<h2>Content</h2>`,
  controller: function ContentController() {
    var ctrl = this;
    function clickHandler() {
      ctrl.doExpensiveThing();
      console.log('clicked');
    }
    ctrl.$onInit = function() {
      ctrl.mem = [];
      document.addEventListener('click', clickHandler)
    }
    ctrl.doExpensiveThing = function() {
      ctrl.mem.push(new Array(1000000).join('angular'));
    }
    ctrl.$onDestroy = function() {
      document.removeEventListener('click', clickHandler);
      console.log('destroyed');
    }
  }
};

angular
  .module('app')
  .component('content', content)
;
