var content = {
  bindings: {},
  template: `<h2>Content Component (ng-if)</h2>`,
  controller: function ContentController() {
    this.$onDestroy = function() {
      console.log('ON DESTROY FIRED! CONTENT COMPONENT!');
    }
  }
};

angular
  .module('app')
  .component('content', content)
;